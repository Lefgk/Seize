"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import img1 from "@/Images/ego1.webp";
import img2 from "@/Images/ego2.jpg";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crosshair, Target, Shield, Zap, ChevronRight } from "lucide-react";
import abi from "@/config/abi";
import { useChainData } from "@/hooks/useChainData";
import { useEgoVersusContract } from "@/hooks/useCampaignFactory";
import { useAccount, useClient, usePublicClient, useWalletClient } from "wagmi";
import { getContract } from "viem";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Page() {
  const { address } = useAccount();
  const contractInstance = useEgoVersusContract();
  const { data: walletClient } = useWalletClient();

  const [tierDeposits, setTierDeposits] = useState({
    Tier1: "",
    Tier2: "",
    Tier3: "",
  });

  const [tierPrices, setTierPrices] = useState({
    tier1Price: BigInt(0),
    tier2Price: BigInt(0),
    tier3Price: BigInt(0),
  });
  const [userContributions, setUserContributions] = useState({
    Tier1: BigInt(0),
    Tier2: BigInt(0),
    Tier3: BigInt(0),
  });
  const [userContributionsa, setUserContributionsa] = useState({
    Tier1a: BigInt(0),
    Tier2a: BigInt(0),
    Tier3a: BigInt(0),
  });
  // const [snackbar, setSnackbar] = useState({
  //   open: false,
  //   message: "",
  //   severity: "info",
  // });

  const client = useClient();
  const chainData = useChainData();

  const publicClient = usePublicClient({ chainId: chainData.chainId });

  useEffect(() => {
    if (address) {
      // fetchTierCounts();
      fetchTierPrices();
      fetchUserContributions();
    }
  }, [address]);

  // const fetchTierCounts = async () => {
  //   try {
  //     if (!contractInstance) throw new Error("Contract not found");
  //     const tier1Count =
  //       await contractInstance.read.getTotalContributorsPerTier([1]);

  //     const tier2Count =
  //       await contractInstance.read.getTotalContributorsPerTier([2]);

  //     const tier3Count =
  //       await contractInstance.read.getTotalContributorsPerTier([3]);

  //     // setTierCounts({
  //     //   "Tier 1": Number(tier1Count),
  //     //   "Tier 2": Number(tier2Count),
  //     //   "Tier 3": Number(tier3Count),
  //     // });
  //   } catch (error) {
  //     console.error("Error fetching tier counts:", error);
  //   }
  // };

  const fetchTierPrices = async () => {
    try {
      if (!contractInstance) throw new Error("Contract not found");
      const tier1Price = await contractInstance.read.tier1Price();
      const tier2Price = await contractInstance.read.tier2Price();
      const tier3Price = await contractInstance.read.tier3Price();

      setTierPrices({
        tier1Price,
        tier2Price,
        tier3Price,
      });
    } catch (error) {
      console.error("Error fetching tier prices:", error);
    }
  };

  const fetchUserContributions = async () => {
    try {
      if (!contractInstance) throw new Error("Contract not found");
      if (!address) throw new Error("Not connected");
      const Tier1 = await contractInstance.read.getContributionByTier([
        address,
        1,
      ]);

      const Tier2 = await contractInstance.read.getContributionByTier([
        address,
        2,
      ]);

      const Tier3 = await contractInstance.read.getContributionByTier([
        address,
        3,
      ]);
      const Tier1a = await contractInstance.read.totalTier1Contributors();

      const Tier2a = await contractInstance.read.totalTier2Contributors();

      const Tier3a = await contractInstance.read.totalTier3Contributors();
      setUserContributionsa({
        Tier1a,
        Tier2a,
        Tier3a,
      });
      setUserContributions({
        Tier1,
        Tier2,
        Tier3,
      });
    } catch (error) {
      console.error("Error fetching user contributions:", error);
    }
  };
  // console.log(userContributions);
  console.log(1);
  async function ensureTokenApproval(tokenAddress: string, amount: any) {
    if (!walletClient || !publicClient)
      throw new Error("Wallet is not connected");
    if (!contractInstance) throw new Error("Contract error");

    console.log(tokenAddress, amount, address);

    const tokenContract = getContract({
      abi: abi.ERC20,
      address: tokenAddress as `0x${string}`,
      client: { public: publicClient, wallet: client },
    });

    const allowance = await tokenContract.read.allowance([
      address as `0x${string}`,
      contractInstance.address as `0x${string}`,
    ]);

    if (Number(allowance) < amount) {
      const { request } = await publicClient.simulateContract({
        address: tokenAddress as `0x${string}`,
        abi: abi.ERC20,
        functionName: "approve",
        args: [contractInstance.address as `0x${string}`, amount],
        account: walletClient?.account,
        gas: BigInt(5000000),
      });
      await walletClient.writeContract(request);

      console.log(`Token approval granted for ${tokenAddress}`);
    } else {
      console.log(
        `Token ${tokenAddress}  has already ${
          Number(allowance) / 10 ** 18
        } allowance`
      );
    }
  }
  function getTokenInfoBySymbol(
    tokens: Record<string, { symbol: string; decimals: number }>,
    symbol: string
  ): any | undefined {
    for (const [address, tokenData] of Object.entries(tokens)) {
      if (tokenData.symbol === symbol) {
        return [tokenData, address]; // Return the token data if the symbol matches
      }
    }
    return undefined; // Return undefined if the symbol is not found
  }

  const handleTierClick = async (tier: string, index: number) => {
    try {
      console.log(chainData);
      const tokenInfo = getTokenInfoBySymbol(chainData.tokens, "USDC");
      if (!walletClient || !publicClient)
        throw new Error("Wallet is not connected");
      if (!tokenInfo[1]) throw new Error("no USDC");
      if (!contractInstance) throw new Error("Contract error");
      const values = Object.values(tierDeposits);
      let quantity = 0;
      if (index == 0) {
        quantity = Number(values[0]);
      } else if (index == 1) {
        quantity = Number(values[1]);
      } else {
        quantity = Number(values[2]);
      }
      // setSelectedTier(tier === selectedTier ? null : tier);

      const price =
        tier === "Tier 1"
          ? Number(tierPrices.tier1Price) * quantity
          : tier === "Tier 2"
          ? Number(tierPrices.tier2Price) * quantity
          : Number(tierPrices.tier3Price) * quantity;
      // console.log(price, quantity);
      const tierNumber = tier === "Tier 1" ? 1 : tier === "Tier 2" ? 2 : 3;
      await ensureTokenApproval(tokenInfo[1], price);

      const { request } = await publicClient.simulateContract({
        address: contractInstance.address as `0x${string}`,
        abi: abi.SteadFast,
        functionName: "contribute",
        args: [tierNumber, BigInt(quantity)],
        account: walletClient?.account,
        gas: BigInt(5000000),
      });
      await walletClient.writeContract(request);

      // setSnackbar({
      //   open: true,
      //   message: `Contribution to ${tier} successful!`,
      //   severity: "success",
      // });

      // fetchTierCounts();
      fetchUserContributions();
    } catch (error) {
      // setSnackbar({
      //   open: true,
      //   message: "Transaction failed. Please try again.",
      //   severity: "error",
      // });
      console.error("Error contributing:", error);
    }
  };

  const handleSetDeposit = (e: any, tier: any) => {
    const value = e.target.value;
    console.log(value, tier);
    console.log(
      value == "Tier 1" ? "Tier1" : value == "Tier 2" ? "Tier2" : "Tier3"
    );
    setTierDeposits((prevDeposits) => ({
      ...prevDeposits,
      [tier == "Tier 1" ? "Tier1" : tier == "Tier 2" ? "Tier2" : "Tier3"]:
        value,
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter skew-x-[-6deg] transform">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-300">
              EgoVersus:
            </span>
            <span className="block text-white drop-shadow-[0_0_25px_rgba(255,0,0,0.3)]">
              The First Strike
            </span>
          </h1>
          <p className="text-3xl font-bold text-red-400">
            $50,000 Fundraising Campaign
          </p>
          <Link href={"https://discord.gg/74eCKsww"} target="_blank">
            <Button className="bg-red-500 hover:bg-red-600 text-white text-xl font-bold px-12 py-6 my-6 rounded-none skew-x-[-6deg] transform transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(255,0,0,0.5)]">
              Explore Campaign
            </Button>
          </Link>
        </div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-8 left-8 w-32 h-32 border-l-2 border-t-2 border-red-500 opacity-60"></div>
        <div className="absolute bottom-8 right-8 w-32 h-32 border-r-2 border-b-2 border-red-500 opacity-60"></div>
      </section>

      {/* About Section */}
      <section className="relative py-32 px-4 md:px-20">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">
            About the Campaign
          </h2>
          <div className="space-y-6 text-lg text-gray-300">
            <p className="border-l-4 border-red-500 pl-6">
              We are thrilled to announce our $50,000 fundraising campaign to
              fuel the development of EgoVersus: The First Strike. This
              groundbreaking game promises to revolutionize the gaming industry
              with its unique blend of...
            </p>
            <p className="border-l-4 border-red-500 pl-6">
              By contributing to this campaign, you&apos;re not just
              pre-ordering a game, you&apos;re becoming part of a movement that
              will shape the future of gaming.
            </p>
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="relative py-32 px-4 md:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent_70%)]"></div>
        <div className="relative z-10">
          <h2 className="text-5xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">
            Development Milestones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Crosshair className="w-8 h-8" />,
                title: "25% Raised",
                description:
                  "Dynamic Asset Loot Box System: Unlock an innovative system for randomized in-game items and NFTs.",
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "50% Raised",
                description:
                  "Asset Naming Service: Bring your in-game assets and NFTs to life with unique, personalized names.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "75% Raised",
                description:
                  "Game Asset Renting Service: Explore new earning potentials by renting your in-game items and NFTs.",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "100% Raised",
                description:
                  "Asset Upgrading Service: Take your gameplay to the next level with enhanced items and NFTs.",
              },
            ].map((milestone, index) => (
              <Card
                key={index}
                className="bg-black/50 border border-red-500/30 backdrop-blur-sm hover:border-red-500 transition-all group"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-4 text-2xl">
                    <div className="p-3 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-all">
                      {milestone.icon}
                    </div>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">
                      {milestone.title}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {milestone.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="relative py-32 px-4 md:px-20 bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,0,0.05)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10">
          <h2 className="text-5xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">
            Choose Your Tier
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Tier 1",
                price: 50,
                max: 300,
                nfts: 1,
                given: Number(userContributionsa.Tier1a),
              },
              {
                title: "Tier 2",
                price: 100,
                max: 200,
                nfts: 2,
                given: Number(userContributionsa.Tier2a),
              },
              {
                title: "Tier 3",
                price: 150,
                max: 100,
                nfts: 5,
                extra: "Custom Legendary 3D Character",
                given: Number(userContributionsa.Tier3a),
              },
            ].map((tier, index) => (
              <Card
                key={index}
                className="bg-black/50 border border-red-500/30 backdrop-blur-sm hover:border-red-500 transition-all group"
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">
                    {tier.title}
                  </CardTitle>
                  <CardDescription className="text-xl text-red-500">
                    ${tier.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-gray-300">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-red-500" />
                      {tier.nfts} Alter Ego Hunter NFTs
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-red-500" />
                      Early Investor Role & Access
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-red-500" />
                      Exclusive Weapon Skin Package
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-red-500" />
                      Access to Early Beta Testing
                    </li>
                    {tier.extra && (
                      <li className="flex items-center gap-2">
                        <ChevronRight className="w-5 h-5 text-red-500" />
                        {tier.extra}
                      </li>
                    )}
                  </ul>
                  <p className="mt-6 text-gray-400">
                    {" "}
                    {tier.given}/{tier.max} Funded
                  </p>
                  <p className="mb-4 text-sm">
                    Your Contributions:{" "}
                    {
                      userContributions[
                        tier.title == "Tier 1"
                          ? "Tier1"
                          : tier.title == "Tier 2"
                          ? "Tier2"
                          : "Tier3"
                      ]
                    }{" "}
                    Packages
                  </p>
                  <p className="mb-4 text-sm">
                    You will pay:{" "}
                    {(
                      (Number(
                        tierDeposits[
                          tier.title == "Tier 1"
                            ? "Tier1"
                            : tier.title == "Tier 2"
                            ? "Tier2"
                            : "Tier3"
                        ]
                      ) *
                        (tier.title == "Tier 1"
                          ? Number(tierPrices.tier1Price)
                          : tier.title === "Tier 2"
                          ? Number(tierPrices.tier2Price)
                          : Number(tierPrices.tier3Price))) /
                      10 ** 6
                    ).toLocaleString()}{" "}
                    USDC
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-4">
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    className="bg-black/50 border-red-500/30 focus:border-red-500"
                    onChange={(e) => handleSetDeposit(e, tier.title)}
                  />
                  <Button
                    // onClick={() => handleTierClick(tier, tierDeposits[tier])}
                    onClick={() => handleTierClick(tier.title, index)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold"
                  >
                    Fund Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Game Preview Section */}
      <section className="relative py-32 px-4 md:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.15),transparent_70%)]"></div>
        <div className="relative z-10">
          <h2 className="text-5xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">
            Game Preview
          </h2>
          <Tabs defaultValue="preview1" className="w-full max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-red-500/30">
              <TabsTrigger
                value="preview1"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                Game Preview 1
              </TabsTrigger>
              <TabsTrigger
                value="preview2"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                Game Preview 2
              </TabsTrigger>
            </TabsList>
            <TabsContent value="preview1">
              <div className="relative group">
                <Image
                  src={img1.src}
                  width={1280}
                  height={720}
                  alt="Game Preview 1"
                  className="w-full rounded-lg border border-red-500/30 group-hover:border-red-500 transition-all"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-lg"></div>
              </div>
            </TabsContent>
            <TabsContent value="preview2">
              <div className="relative group">
                <Image
                  src={img2.src}
                  width={1280}
                  height={720}
                  alt="Game Preview 2"
                  className="w-full rounded-lg border border-red-500/30 group-hover:border-red-500 transition-all"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-lg"></div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-32 px-4 md:px-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.15),transparent_70%)]"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">
            Shape the Future of Gaming
          </h2>
          <div className="space-y-6 text-lg text-gray-300">
            <p>
              This fundraising campaign offers you a unique opportunity to
              become more than just a player – you&apos;ll be an architect of
              The EgoVerse. Your investment will directly influence the
              game&apos;s development, pushing the boundaries of gaming into
              uncharted territories.
            </p>
            <p>
              With exclusive NFTs, early beta access, and groundbreaking
              features on the horizon, you&apos;ll be at the forefront of a
              gaming revolution. Your contributions will fuel innovations like
              the Dynamic Asset Loot Box System, Asset Naming Service, and Game
              Asset Renting Service.
            </p>
            <p>
              Join us in this thrilling journey as we redefine what's possible
              in gaming. Your support today will shape the immersive world of
              tomorrow in The EgoVerse.
            </p>
          </div>
          <Button className="mt-12 bg-red-500 hover:bg-red-600 text-white text-xl font-bold px-12 py-6 rounded-none skew-x-[-6deg] transform transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(255,0,0,0.5)]">
            Connect Wallet & Contribute
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 md:px-20 border-t border-red-500/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,0,0.05)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">
                EgoVersus
              </h3>
              <p className="text-gray-400">Shaping the future of gaming</p>
            </div>
            <div className="text-center md:text-right">
              <h4 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">
                Connect With Us
              </h4>
              <div className="flex justify-center items-center md:justify-end space-x-6">
                <a
                  href="https://discord.gg/m4XzUXWq"
                  target="_blank"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/TheEgoVerse"
                  target="_blank"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="https://store.steampowered.com/app/3076680/EgoVersus_The_First_Strike/"
                  target="_blank"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.5C6.201 22.5 1.5 17.799 1.5 12S6.201 1.5 12 1.5 22.5 6.201 22.5 12 17.799 22.5 12 22.5zm7.047-10.875L17.25 9.75h-3.844l-1.031-2.063H11.25L10.219 9.75H6.75l-1.797 1.875v6.563l1.797 1.875h10.5l1.797-1.875v-6.563zm-9.422 6.563H7.688v-4.688h1.938v4.688zm3.75 0h-1.938v-4.688h1.938v4.688zm3.75 0h-1.938v-4.688h1.938v4.688z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center text-gray-400">
            <p>&copy; 2025 EgoVersus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
