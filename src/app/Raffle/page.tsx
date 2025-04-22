"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { useState, useEffect } from "react";
import abi from "@/config/abi";
import { useRaffleContract } from "@/hooks/useCampaignFactory";
import { useChainData } from "@/hooks/useChainData";
export default function RafflePage() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const chainData = useChainData();
  const publicClient = usePublicClient({ chainId: chainData.chainId });
  const contractInstance = useRaffleContract();
  const [ticketPriceInETH, setTicketPriceInETH] = useState<number>(0);
  const [tickets, setTickets] = useState("1");
  const [userEntries, setUserEntries] = useState<number>(0);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSetTickets = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTickets(e.target.value);
  };

  // Fetch ticket price in native currency
  const fetchTicketPrice = async () => {
    try {
      if (!contractInstance) throw new Error("Contract error");
      let price;
      console.log();
      if (chainData.chainId == 1329) {
        price = await contractInstance.read.getETHForUSDCsei();
      } else {
        price = await contractInstance.read.getETHForUSDC();
      }
      //
      // console.log(Number(price) / 10 ** 18);
      setTicketPriceInETH(Number(price) / 10 ** 18);
    } catch (err) {
      console.error("Error fetching ticket price:", err);
    }
  };

  // Fetch user and total entries
  const fetchEntries = async () => {
    try {
      if (!contractInstance || !address) return;

      const userEntries = await contractInstance.read.getUserTickets([
        address as `0x${string}`,
      ]);
      const totalEntries = await contractInstance.read.totalTickets();

      setUserEntries(Number(userEntries));
      setTotalEntries(Number(totalEntries));
    } catch (err) {
      console.error("Error fetching entries:", err);
    }
  };

  const handleBuyTickets = async () => {
    setIsLoading(true);
    setError("");
    if (!contractInstance || !address) return;
    try {
      if (!address) throw new Error("Wallet is not connected.");
      if (!tickets || Number(tickets) <= 0) {
        throw new Error("Please enter a valid number of tickets.");
      }
      let price;
      if (chainData.chainId == 1329) {
        price = await contractInstance.read.getETHForUSDCsei();
      } else {
        price = await contractInstance.read.getETHForUSDC();
      }
      const quantity = Number(tickets);
      const totalPrice = price * BigInt(quantity);

      if (!walletClient || !publicClient)
        throw new Error("Wallet is not connected");
      // console.log(chainData.chainId, quantity, BigInt(totalPrice * 10 ** 18));
      const { request } = await publicClient.simulateContract({
        address: contractInstance?.address as `0x${string}`,
        abi: abi.Raffle,
        functionName: "buyTickets",
        args: [BigInt(quantity)],
        value: BigInt(totalPrice),
        account: walletClient?.account,
      });

      await walletClient.writeContract(request);
      setTickets("");
      fetchEntries(); // Update entries after purchase
      setIsLoading(false);
    } catch (err: any) {
      console.error("Error purchasing tickets:", err);
      setError(err.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketPrice();
    fetchEntries();
  }, [address]);

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{ marginTop: "100px" }}
    >
      {/* Hero Section */}
      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4">
        <h1 className="text-7xl md:text-8xl font-black tracking-tighter skew-x-[-6deg] transform">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-300">
            Seize Your Opportunity
          </span>
        </h1>
        <p className="text-3xl font-bold text-red-400">RAFFLE Nvidia 5070</p>
        <p className="text-lg text-gray-300">
          Join the raffle for a chance to win the incredible Nvidia 5070!
        </p>
      </div>

      {/* Development Milestones Section */}
      <section className="relative py-16 px-4 md:px-20">
        <div className="relative z-10">
          <h2 className="text-5xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">
            Raffle Milestones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Milestone 1",
                description:
                  "Reach $2,500 in ticket sales: Unlock a bonus prize for participants.",
              },
              {
                title: "Milestone 2",
                description:
                  "Reach $5,000 in ticket sales: Double the grand prize!",
              },
              {
                title: "Milestone 3",
                description:
                  "Reach $7,500 in ticket sales: Include 5 additional winners for smaller prizes.",
              },
              {
                title: "Milestone 4",
                description:
                  "Reach $10,000 in ticket sales: Grand surprise revealed!",
              },
            ].map((milestone, index) => (
              <Card
                key={index}
                className="bg-black/50 border border-red-500/30 backdrop-blur-sm hover:border-red-500 transition-all group"
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">
                    {milestone.title}
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

      {/* Raffle Entry Section */}
      <section className="relative py-16 px-4 md:px-20">
        <div className="relative z-10 max-w-4xl mx-auto">
          <Card className="bg-black/50 border border-red-500/30 backdrop-blur-sm hover:border-red-500 transition-all group">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">
                SEIZE YOUR OPPORTUNITY
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-6">
              <h2 className="text-xl font-semibold text-red-400">
                How It Works
              </h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Entry Fee:{" "}
                  <span className="text-red-500">
                    {ticketPriceInETH.toFixed(6)} {chainData.nativeToken} per
                    ticket (~$3)
                  </span>
                  .
                </li>
                <li>Deadline: 1st March 2025</li>
              </ol>
              <p className="text-gray-400">
                🎟️ The more tickets you grab, the higher your chances of
                winning!
              </p>
              <ul className="list-none space-y-2">
                <li>✅ 100% secure transactions powered by Seize.</li>
                <li>✅ Support an exciting community-driven raffle event.</li>
              </ul>
              <p className="text-sm text-gray-500">
                ⚡ <strong>Winner Announcement:</strong> The lucky winner will
                be announced on 1st March 2025 via X and Discord.
              </p>
              <p className="text-gray-400 mt-4">
                💬 Boost your chances by interacting on Twitter! Retweet and
                comment on the official post
              </p>
              <ul className="list-disc list-inside text-red-500 space-y-1">
                <li>
                  <a
                    href="https://x.com/Seizefund"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Follow us on Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/Seizefund/status/1882889807757803728"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Retweet the official raffle post
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/Seizefund/status/1882889807757803728"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Comment to share your excitement!
                  </a>
                </li>
              </ul>

              {address ? (
                <>
                  <div className="space-y-4">
                    Enter number of tickets :
                    <input
                      type="number"
                      placeholder=""
                      style={{ border: "1px solid" }}
                      className="w-full p-2 bg-black/50 border-red-500/30 focus:border-red-500 text-white"
                      value={tickets}
                      onChange={handleSetTickets}
                    />
                    <p className="text-gray-300">
                      Total Cost:{" "}
                      {(Number(tickets) * ticketPriceInETH).toFixed(6)}{" "}
                      {chainData.nativeToken}
                    </p>
                    <Button
                      onClick={handleBuyTickets}
                      disabled={isLoading}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-bold"
                    >
                      {isLoading ? "Processing..." : "Buy Tickets"}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-red-400">
                  Please connect your wallet to participate.
                </p>
              )}
              <p className="text-gray-400 mt-4">
                👤 Your Entries: {userEntries}
              </p>
              <p className="text-gray-400 mt-4">
                💬 Total Entries: {totalEntries}
              </p>
              {error && <p className="text-red-500">{error}</p>}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 md:px-20 text-center">
        <p className="text-gray-400">
          &copy; 2025 Seize Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
