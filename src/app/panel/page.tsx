"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useClient, usePublicClient, useWalletClient } from "wagmi";
import { getContract } from "viem";
import abi from "@/config/abi";
// import contracts from "@/constants/contracts";
import { useCampaignFactory, useFeeContract } from "@/hooks/useCampaignFactory";

export interface CustomCampaign {
  campaignAddress: string;
  title: string;
  goalAmount: number;
  endTime: Date;
  isActive: boolean;
  chainId: string;
  campaignType: string;
  creator: string;
  creationTime: Date;
  category?: string;
  perks?: string[];
  website?: string;
  youtube?: string;
  extensionRequested: boolean;
  // Add other properties with `?` to make them optional
}
import { useChainData } from "@/hooks/useChainData";
export default function CampaignManager() {
  const { address } = useAccount();
  const [campaigns, setCampaigns] = useState<CustomCampaign[]>([]);

  const [FeeAmount, setFeeAmount] = useState(0);
  const [FeeAmountN, setFeeAmountN] = useState(0);

  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "ascending",
  });
  const client = useClient();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const campaignFactoryContract = useCampaignFactory();
  const FeeContract = useFeeContract();
  const chainData = useChainData();

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
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        if (!campaignFactoryContract) throw new Error("Contract not found");
        if (!FeeContract) throw new Error("Contract not found");

        if (!walletClient || !publicClient)
          throw new Error("Wallet is not connected");

        const tokenInfo = getTokenInfoBySymbol(chainData.tokens, "USDC");

        const tokenContract = getContract({
          abi: abi.ERC20,
          address: tokenInfo[1] as `0x${string}`,
          client: { public: publicClient, wallet: client },
        });
        const usdcBal = Number(
          await tokenContract.read.balanceOf([FeeContract?.address])
        );
        setFeeAmount(usdcBal);

        const balance = Number(
          await publicClient.getBalance({
            address: FeeContract?.address,
          })
        );
        setFeeAmountN(balance);
        const total = Number(
          await campaignFactoryContract.read.totalCampaigns()
        );
        if (total > 0) {
          const campaigns =
            await campaignFactoryContract.read.getCampaignsInRange([
              BigInt(0),
              BigInt(total - 1),
              BigInt(0),
            ]);

          setCampaigns(
            campaigns.map((campaign: any) => ({
              campaignAddress: campaign.campaignAddress,
              title: campaign.title,
              goalAmount: Number(campaign.goalAmount) / 10 ** 18,
              endTime: new Date(Number(campaign.endTime) * 1000),
              isActive: campaign.isActive,
              chainId: campaign.chainId, // Add other properties required by the Campaign type
              campaignType: campaign.campaignType,
              creator: campaign.creator,
              creationTime: new Date(Number(campaign.creationTime) * 1000),
              extensionRequested: campaign.extensionRequested,
              // Add any additional fields that your Campaign type expects
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [address, walletClient, publicClient]);

  const handleAction = async (campaignAddress: any, action: any) => {
    try {
      if (!walletClient || !publicClient)
        throw new Error("Wallet is not connected");
      // if (!contractInstance) throw new Error("Contract error");

      // let method;
      // switch (action) {
      //   case "cancel":
      //     method = "cancelCampaign";
      //     break;
      //   case "end":
      //     method = "endCampaign";
      //     break;
      //   case "extend":
      //     method = "approveExtension";
      //     break;
      //   default:
      //     return;
      // }

      const { request } = await publicClient.simulateContract({
        address: campaignAddress as `0x${string}`,
        abi: abi.Campaign,
        functionName: action,
        args: [],
        account: walletClient?.account,
        gas: BigInt(5000000),
      });
      await walletClient.writeContract(request);
      // await method.send({ from: address, gas: "1000000" });

      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.campaignAddress === campaignAddress
            ? { ...campaign, isActive: action !== "cancel" }
            : campaign
        )
      );
    } catch (error) {
      console.error(`${action} failed:`, error);
    }
  };

  const sendNFees = async () => {
    if (!walletClient || !publicClient)
      throw new Error("Wallet is not connected");
    if (!FeeContract) throw new Error("Contract error");

    const { request } = await publicClient.simulateContract({
      address: FeeContract.address as `0x${string}`,
      abi: abi.FeeSplitter,
      functionName: "distribute",
      args: [],
      account: walletClient?.account,
      gas: BigInt(5000000),
    });
    await walletClient.writeContract(request);
  };
  const sendFees = async () => {
    if (!walletClient || !publicClient)
      throw new Error("Wallet is not connected");
    if (!FeeContract) throw new Error("Contract error");

    const { request } = await publicClient.simulateContract({
      address: FeeContract.address as `0x${string}`,
      abi: abi.FeeSplitter,
      functionName: "distributeUsdc",
      args: [],
      account: walletClient?.account,
      gas: BigInt(5000000),
    });
    await walletClient.writeContract(request);
  };

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedCampaigns = [...campaigns].sort((a: any, b: any) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "ascending" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  if (loading) return <div>Loading campaigns...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Campaign Manager</h1>
      Current USDC fees : {FeeAmount / 10 ** 6}
      <br />
      <button
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
        // className="table-auto  border-collapse border border-gray-300"
        onClick={() => sendFees()}
      >
        Distribute USDC Fees
      </button>
      <br />
      <br />
      Current native fees : {FeeAmountN / 10 ** 6}
      <br />
      <button
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
        onClick={() => sendNFees()}
      >
        Distribute native Fees
      </button>
      <br />
      <br />
      <br />
      <div className="overflow-x-auto">
        <table
          className="table-auto w-full border-collapse border border-gray-300"
          style={{ backgroundColor: "black" }}
        >
          <thead>
            <tr className="bg-gray-100" style={{ backgroundColor: "black" }}>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer text-left"
                onClick={() => requestSort("title")}
              >
                Title
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer text-left"
                onClick={() => requestSort("goalAmount")}
              >
                Goal Amount
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer text-left"
                onClick={() => requestSort("endTime")}
              >
                End Time
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Status
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Extension Req?
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCampaigns.map((campaign, index) => (
              <tr key={index} className={`${"bg-gray"} `}>
                <td className="border border-gray-300 px-4 py-2">
                  {campaign.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {campaign.goalAmount} ETH
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {campaign.endTime.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {campaign.isActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Ended</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {campaign.extensionRequested ? "YES" : "NO"}
                </td>

                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  {campaign.isActive && (
                    <>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        onClick={() =>
                          handleAction(campaign.campaignAddress, "cancel")
                        }
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        onClick={() =>
                          handleAction(campaign.campaignAddress, "end")
                        }
                      >
                        End
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                        onClick={() =>
                          handleAction(campaign.campaignAddress, "extend")
                        }
                      >
                        Extend
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
