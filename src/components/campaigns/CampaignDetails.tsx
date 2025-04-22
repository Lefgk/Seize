"use client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  Globe,
  Calendar,
  Loader2,
  MessageSquare,
  Coins,
  Undo,
} from "lucide-react";
import {
  FaDiscord,
  FaFlag,
  FaTelegram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail, MdPictureAsPdf } from "react-icons/md";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  getRemainingTime,
  getShortErrorMessage,
  shortenText,
  valueNumFormatter,
} from "@/utils/helpers";
import { Campaign, CampaignContributor } from "@/types/campaign";
import Image from "../ui/image";
import { useTime } from "@/hooks/useTime";
import { Input } from "../ui/input";
import { getContract, parseEther } from "viem";
import abi from "@/config/abi";
import { useAccount, useClient, usePublicClient, useWalletClient } from "wagmi";
import { toast } from "react-toastify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useChainData } from "@/hooks/useChainData";

interface CampaignDetailsProps {
  campaign: Campaign;
  getCampaign: () => void;
  setCampaign: Dispatch<SetStateAction<Campaign | null>>;
  contributors: CampaignContributor[] | null;
  userContribution: number;
}

export default function CampaignDetails({
  campaign,
  getCampaign,
  userContribution,
  setCampaign,
}: CampaignDetailsProps) {
  // console.log(campaign);
  const yt1 = "https://www.youtube.com/watch?v=jg0MaIM-Fzk";
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [entries, setEntries] = useState("");
  const time = useTime();
  const [loading, setLoading] = useState(false);
  const client = useClient();
  const chainData = useChainData();
  const publicClient = usePublicClient({ chainId: chainData.chainId });
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const goalAmount = useMemo(
    () =>
      campaign.maxDeposits === 0
        ? campaign.goalAmount
        : campaign.goalAmount * campaign.maxDeposits,
    [campaign]
  );
  const token = useMemo(
    () => chainData.tokens[campaign?.token || ""],
    [chainData, campaign]
  );

  const isOwner = useMemo(
    () => campaign?.creator?.toString() === address?.toString(),
    [address, campaign]
  );
  // console.log(campaign.endTime * 1000, time, campaign.endTime < time / 1000);
  const handleFund = async () => {
    try {
      const amountNum = Number(amount);
      if (!amountNum || isNaN(amountNum) || amountNum <= 0) {
        throw new Error("Please enter a valid amount.");
      }

      if (!walletClient || !publicClient)
        throw new Error("Wallet is not connected");
      if (campaign.campaignType === "Invest") {
        const decimals = Math.pow(10, token?.decimals || 18);
        const goalAmount =
          (campaign.maxDeposits * campaign.goalAmount) / decimals;
        if (campaign.totalContributions / decimals + amountNum > goalAmount) {
          throw new Error("You cannot invest more than the goal amount");
        }
      }
      setLoading(true);
      let amountWithDecimals = parseEther(amount);
      if (campaign.token !== "0x0000000000000000000000000000000000000000") {
        const tokenContract = getContract({
          abi: abi.ERC20,
          address: campaign.token as `0x${string}`,
          client: { public: publicClient, wallet: client },
        });
        const allowance = await tokenContract.read.allowance([
          campaign.token as `0x${string}`,
          campaign.campaignAddress as `0x${string}`,
        ]);
        if (Number(allowance) < Number(amountWithDecimals)) {
          console.log("Approving token transfer...");
          if (token)
            amountWithDecimals = BigInt(
              Number(amount) * Math.pow(10, token.decimals)
            );
          const { request } = await publicClient.simulateContract({
            address: campaign.token as `0x${string}`,
            abi: abi.ERC20,
            functionName: "approve",
            args: [
              campaign.campaignAddress as `0x${string}`,
              amountWithDecimals,
            ],
            account: walletClient?.account,
            gas: BigInt(5000000),
          });
          await walletClient.writeContract(request);

          console.log("Token transfer approved.");
        }
      }

      console.log("Making donation...");
      const { request } = await publicClient.simulateContract({
        address: campaign.campaignAddress as `0x${string}`,
        abi: abi.Campaign,
        functionName: "contribute",
        args: [amountWithDecimals],
        account: walletClient?.account,
        value:
          campaign.token === "0x0000000000000000000000000000000000000000"
            ? amountWithDecimals
            : BigInt("0"),
        gas: BigInt(5000000),
      });
      await walletClient.writeContract(request);
      setCampaign(
        campaign !== null
          ? {
              ...campaign,
              totalContributions:
                Number(campaign.totalContributions) +
                Number(amountWithDecimals),
            }
          : null
      );
      toast.success("Donation successful!");
    } catch (e: any) {
      console.error("Donation failed:", e);
      toast.error(getShortErrorMessage(e, "Donation Failed, Unknown Error"));
    } finally {
      setLoading(false);
    }
  };
  // console.log(campaign.socialLinks);
  const handleEnd = async () => {
    try {
      if (!walletClient || !publicClient)
        throw new Error("Wallet is not connected");
      setLoading(true);

      const campaignContractAddress = campaign.campaignAddress as `0x${string}`;

      const { request } = await publicClient.simulateContract({
        address: campaignContractAddress,
        abi: abi.Campaign,
        functionName: "endCampaign",
        account: walletClient?.account,
        gas: BigInt(5000000),
      });

      await walletClient.writeContract(request);
      getCampaign();
      toast.success("Campaign Ended successfully!");
    } catch (e) {
      console.error("Campaign End failed:", e);
      toast.error(
        getShortErrorMessage(e, "Failed to End campaign, Unknown Error")
      );
      // toast.error("Failed to End campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleExtension = async () => {
    try {
      if (!walletClient || !publicClient)
        throw new Error("Wallet is not connected");
      setLoading(true);

      const campaignContractAddress = campaign.campaignAddress as `0x${string}`;

      const { request } = await publicClient.simulateContract({
        address: campaignContractAddress,
        abi: abi.Campaign,
        functionName: "requestExtension",
        account: walletClient?.account,
        gas: BigInt(5000000),
      });

      await walletClient.writeContract(request);
      getCampaign();
      toast.success("Extension requested successfully!");
    } catch (e) {
      console.error("Extension request failed:", e);
      toast.error(
        getShortErrorMessage(e, "Failed to request extension, Unknown Error")
      );
      // toast.error("Failed to request extension. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      if (!walletClient || !publicClient)
        throw new Error("Wallet is not connected");
      setLoading(true);

      const campaignContractAddress = campaign.campaignAddress as `0x${string}`;

      const { request } = await publicClient.simulateContract({
        address: campaignContractAddress,
        abi: abi.Campaign,
        functionName: "cancelCampaign",
        account: walletClient?.account,
        gas: BigInt(5000000),
      });

      await walletClient.writeContract(request);
      getCampaign();
      toast.success("Campaign canceled successfully!");
    } catch (e) {
      console.error("Cancel campaign failed:", e);
      toast.error(
        getShortErrorMessage(e, "Failed to cancel the campaign, Unknown Error")
      );
      // toast.error("Failed to cancel the campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    try {
      if (!walletClient || !publicClient)
        throw new Error("Wallet is not connected");
      setLoading(true);

      const campaignContractAddress = campaign.campaignAddress as `0x${string}`;

      const { request } = await publicClient.simulateContract({
        address: campaignContractAddress,
        abi: abi.Campaign,
        functionName: "refund",
        account: walletClient?.account,
        gas: BigInt(5000000),
      });

      await walletClient.writeContract(request);
      getCampaign();
      toast.success("Refund processed successfully!");
    } catch (error) {
      console.error("Refund failed:", error);
      toast.error("Failed to process refund. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Copied Link");
  };

  return (
    <div>
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
      </Button>

      <div className="grid gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-4 overflow-hidden">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold mb-2">
                    {campaign.title}
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    size="icon"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Link
                          href={"https://discord.gg/q49drhkrXD"}
                          target="_blank"
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full border-2 border-red-500 text-red-500 hover:bg-red-200/5 hover:text-red-600 transition-colors duration-300"
                          >
                            <FaFlag className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="bg-red-500 text-white px-3 py-2 text-sm font-medium"
                      >
                        Report this Campaign
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full pb-[100%] relative overflow-hidden">
                <Image
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="rounded-lg w-full h-full absolute top-0 left-0"
                  imgClassName="w-full h-full object-cover object-center"
                />
              </div>
              {campaign.story && (
                <div className="mt-6 space-y-4 text-wrap break-words">
                  <h3 className="text-xl font-semibold">About this campaign</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {campaign.story}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Perks</CardTitle>
            </CardHeader>
            <CardContent>
              {campaign.perks ? (
                <div className="space-y-4">{campaign.perks}</div>
              ) : (
                <p className="text-muted-foreground">
                  No perks available for this campaign.
                </p>
              )}
            </CardContent>
          </Card>
          {campaign.pdfUrl && (
            <embed
              src={campaign.pdfUrl}
              type="application/pdf"
              className="w-full h-96"
            />
          )}
        </div>

        <div className="space-y-4 lg:col-span-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Social Links</CardTitle>
            </CardHeader>

            <CardContent className="!pt-2">
              {campaign.website ||
              campaign.socialLinks?.discord ||
              campaign.socialLinks?.telegram ||
              campaign.socialLinks?.twitter ||
              campaign.socialLinks?.youtube ||
              campaign.socialLinks?.email ? (
                <div className="flex gap-2">
                  {campaign.website && (
                    <Link
                      // href={campaign.website}
                      href={
                        campaign.website.startsWith("http")
                          ? campaign.website
                          : `https://${campaign.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Globe size={24} />
                    </Link>
                  )}
                  {campaign.socialLinks?.discord && (
                    <Link
                      href={campaign.socialLinks?.discord}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <FaDiscord size={24} />
                    </Link>
                  )}
                  {campaign.socialLinks?.telegram && (
                    <Link
                      href={campaign.socialLinks?.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <FaTelegram size={24} />
                    </Link>
                  )}
                  {campaign.socialLinks?.twitter && (
                    <Link
                      // href={campaign.socialLinks?.twitter}
                      // href={
                      //   campaign.socialLinks?.twitter.startsWith("x.com")
                      //     ? campaign.socialLinks?.twitter
                      //     : `https://${campaign.socialLinks?.twitter}`
                      // }
                      href={
                        campaign.socialLinks?.twitter
                          ? campaign.socialLinks?.twitter.startsWith("http")
                            ? campaign.socialLinks?.twitter
                            : `https://${campaign.socialLinks?.twitter}`
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <FaTwitter size={24} />
                    </Link>
                  )}
                  {campaign.socialLinks?.youtube ||
                    (campaign.campaignAddress ==
                      "0x5Ddff17cC61d95d35001738e649f295533EE38dd" && (
                      <Link
                        href={yt1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <FaYoutube size={24} />
                      </Link>
                    ))}
                  {campaign.socialLinks?.email && (
                    <Link
                      href={`mailto:${campaign.socialLinks?.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MdEmail size={24} />
                    </Link>
                  )}
                  {campaign.campaignAddress ==
                    "0x5Ddff17cC61d95d35001738e649f295533EE38dd" && (
                    <Link
                      href="/Influx%20Structure%20PD%20Official.pdf"
                      // href={`mailto:${campaign.socialLinks?.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MdPictureAsPdf size={24} />
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No Social Links
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress
                  value={(campaign.totalContributions / goalAmount) * 100}
                  className="h-2"
                />
                <div>
                  <span className="font-semibold uppercase">
                    {valueNumFormatter(
                      Number(campaign.totalContributions) /
                        Math.pow(10, token?.decimals || 18)
                    )}{" "}
                    {token?.symbol} (
                    {
                      +Number(
                        (
                          (campaign.totalContributions * 100) /
                          goalAmount
                        ).toFixed(1)
                      )
                    }
                    %) raised
                  </span>
                </div>
              </div>
              <div className="mt-6 grid md:grid-cols-2 text-center gap-2">
                <div className="p-2 md:col-span-2 bg-default-800 rounded-md">
                  <p className="text-2xl font-bold text-ellipsis max-w-full overflow-hidden whitespace-nowrap">
                    {valueNumFormatter(
                      Number(goalAmount) / Math.pow(10, token?.decimals || 18)
                    )}{" "}
                    {token?.symbol}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium uppercase">
                    Goal
                  </p>
                </div>
                <div className="p-2 bg-default-800 rounded-md">
                  <p className="text-2xl font-bold">{campaign.contributors}</p>
                  <p className="text-sm text-muted-foreground font-medium uppercase">
                    Backers
                  </p>
                </div>
                <div className="p-2 rounded-md bg-default-800">
                  <p className="text-2xl font-bold uppercase">
                    {campaign.isActive
                      ? // && time < campaign.endTime * 1000
                        getRemainingTime(campaign.endTime * 1000 - time)
                      : "Ended"}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium uppercase">
                    Time Left
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              {isOwner ? (
                <div className="w-full flex-col">
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    {campaign.isActive && (
                      <Button
                        variant="destructive"
                        onClick={handleCancel}
                        className="w-full sm:w-auto"
                      >
                        <Undo className="h-4 w-4" /> Cancel
                      </Button>
                    )}

                    {campaign.isActive && (
                      <Button
                        variant="outline"
                        onClick={handleExtension}
                        disabled={
                          campaign.endTime < time / 1000 ||
                          campaign.campaignType === "Donate"
                        }
                        className="w-full sm:w-auto"
                      >
                        <MessageSquare className="h-4 w-4" /> Request Extension
                      </Button>
                    )}

                    {campaign.isActive && (
                      <Button
                        variant="outline"
                        onClick={handleEnd}
                        disabled={
                          !campaign.isActive
                          // campaign.endTime < time / 1000
                        }
                        className="w-full sm:w-auto"
                      >
                        <MessageSquare className="h-4 w-4" /> End
                      </Button>
                    )}
                  </div>

                  <Link href={"https://discord.gg/3ub3XtvTKy"} target="_blank">
                    <Button
                      variant="ripple"
                      className="w-full mt-2 bg-green-600 hover:bg-green-700"
                    >
                      Verify LLC
                    </Button>
                  </Link>
                </div>
              ) : // <div className="flex flex-col sm:flex-row gap-2 w-full">
              //   {/* <Button
              //   variant="destructive"
              //   onClick={handleCancel}
              //   className="w-full sm:w-auto"
              // >
              //   <Undo className="h-4 w-4" /> Cancel
              // </Button> */}

              // </div>

              campaign.isActive ? (
                <div className="flex flex-col w-full">
                  {campaign.campaignType === "Donate" ? (
                    <Input
                      type="number"
                      placeholder={`Amount in ${token?.symbol}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  ) : (
                    <>
                      <Input
                        type="number"
                        placeholder={`Number of Entries`}
                        value={entries}
                        onChange={(e) => {
                          const value = Number(e.target.value);

                          if (!isNaN(value)) {
                            setEntries(e.target.value);
                            setAmount(
                              (
                                value *
                                (campaign.goalAmount /
                                  Math.pow(10, token?.decimals || 18))
                              ).toString()
                            );
                          }
                        }}
                      />
                      <div className="px-3 mt-3 space-y-2">
                        <div className="flex items-center">
                          <dt className="text-sm font-medium text-muted-foreground w-1/3">
                            Entry Price
                          </dt>
                          <dd className="text-sm font-semibold">
                            {campaign.goalAmount /
                              Math.pow(10, token?.decimals || 18)}{" "}
                            {token?.symbol}
                          </dd>
                        </div>

                        <Separator />
                        <div className="flex items-center">
                          <dt className="text-sm font-medium text-muted-foreground w-1/3">
                            Max Entries
                          </dt>
                          <dd className="text-sm font-semibold">
                            {campaign.maxDeposits?.toLocaleString("en")}
                          </dd>
                        </div>
                        <Separator />

                        <div className="flex items-center">
                          <dt className="text-sm font-medium text-muted-foreground w-1/3">
                            Total Amount
                          </dt>
                          <dd className="text-sm font-semibold">
                            {isNaN(Number(amount))
                              ? 0
                              : Number(amount).toLocaleString("en")}{" "}
                            {token?.symbol}
                          </dd>
                        </div>
                      </div>
                    </>
                  )}
                  <Button
                    className="mt-2"
                    type="submit"
                    variant={"ripple"}
                    disabled={loading}
                    onClick={handleFund}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Funding...
                      </>
                    ) : (
                      <>Fund</>
                    )}
                  </Button>
                  {/* <Button
                    className="mt-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    variant={"ripple"}
                    onClick={() => setModalOpen(true)}
                  >
                    Buy Crypto
                  </Button> */}
                  {/* {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
                        <button
                          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                          onClick={() => setModalOpen(false)}
                        >
                          ✖
                        </button>
                        <iframe
                          width="100%"
                          height="400"
                          frameBorder="none"
                          allow="camera"
                          src="https://widget.changelly.com?from=*&to=*&amount=500&address=&fromDefault=usd&toDefault=btc&merchant_id=r4J6PmreRvobF484&payment_id=&v=3&type=no-rev-share&color=5f41ff&headerId=1&logo=hide&buyButtonTextId=2"
                        >
                          Can't load widget
                        </iframe>
                      </div>
                    </div>
                  )} */}
                </div>
              ) : userContribution > 0 ? (
                <Button onClick={handleRefund} className="w-full">
                  <Coins className="h-4 w-4" /> Claim Refund
                </Button>
              ) : (
                <div className="text-center font-semibold text-muted-foreground">
                  You did not contribute to this campaign.
                </div>
              )}
              {/* {campaign.isActive ? "u" : "n"} */}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex items-center">
                  <dt className="text-sm font-medium text-muted-foreground w-1/3">
                    Type
                  </dt>
                  <dd className="text-sm font-semibold">
                    {campaign.campaignType}
                  </dd>
                </div>
                <Separator />
                <div className="flex items-center">
                  <dt className="text-sm font-medium text-muted-foreground w-1/3">
                    Creator
                  </dt>
                  <dd className="text-sm font-semibold">
                    {shortenText(campaign.creator)}
                  </dd>
                </div>
                <Separator />
                <div className="flex items-center">
                  <dt className="text-sm font-medium text-muted-foreground w-1/3">
                    End Date
                  </dt>
                  <dd className="text-sm">
                    <Calendar className="inline-block mr-1 h-4 w-4" />
                    {new Date(campaign.endTime * 1000).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      hour12: true,
                    })}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
