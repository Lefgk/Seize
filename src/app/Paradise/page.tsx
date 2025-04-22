"use client";

import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import herobg from "@/Images/final.webp";
// import img from "./IMG2.webp";
import beach from "./SECRETBEACH.webp";
import img2 from "./IMG3.webp";
// import passport from "./Passport_1920x1080.mp4";
import fractals from "./Stamp_on_Page.webp";
import graph from "./graph.png";
import abi from "@/config/abi";
import { useChainData } from "@/hooks/useChainData";
import {
  useParadiseContract,
  // useSteadFastContract,
} from "@/hooks/useCampaignFactory";
import { useAccount, useClient, usePublicClient, useWalletClient } from "wagmi";
import { getContract } from "viem";
import { useEffect, useState } from "react";
// import logo from "@/Images/doogs.webp";
import { FaDiscord, FaTwitter, FaGlobe } from "react-icons/fa6";
import Link from "next/link";
import './scrollbar.css'
const price = 1050;
const AnimatedSection = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function ParadiseLanding() {
  const { address } = useAccount();

  const client = useClient();
  const chainData = useChainData();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient({ chainId: chainData.chainId });
  const contractInstance = useParadiseContract();

  const [Approved, setApproved] = useState(false);
  const [userContributions, setUserContributions] = useState({
    onceOff: "",

  });
  const passport="/videos/Passport_1920x1080.mp4";
  const welcome="/videos/video3.mp4";

  type SelectedAmount = {
    onceOff: string;
  };

  const [selectedAmount, setSelectedAmount] = useState<SelectedAmount>({
    onceOff: "0",
  });
  const [refreshit, setrefreshit] = useState(false);

  useEffect(() => {
    fetchUserContributions();
  }, [address, refreshit]);
  // console.log(address);
  const fetchUserContributions = async () => {
    try {
      if (!contractInstance) throw new Error("Contract not found");
      if (!address) throw new Error("Not connected");
      checkApproval(Number(selectedAmount.onceOff));
      const onceOffContributions =
        await contractInstance.read.tier1Contributions([address]);

      // console.log(onceOffContributions);
      setUserContributions({
        onceOff: onceOffContributions.toString(),
      });
    } catch (error) {
      console.error("Error fetching user contributions:", error);
    }
  };

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

  const checkApproval = async (val: number) => {
    if (!address) throw new Error("Not connected");
    if (!walletClient || !publicClient)
      throw new Error("Wallet is not connected");
    if (!contractInstance) throw new Error("Contract error");

    const tokenInfo = getTokenInfoBySymbol(chainData.tokens, "USDC");

    if (!tokenInfo[1]) throw new Error("no USDC");
    const tokenContract = getContract({
      abi: abi.ERC20,
      address: tokenInfo[1] as `0x${string}`,
      client: { public: publicClient, wallet: client },
    });

    const allowance = await tokenContract.read.allowance([
      address as `0x${string}`,
      contractInstance.address as `0x${string}`,
    ]);
    // console.log(allowance, price * Number(val) * 10 ** tokenInfo[0].decimals);
    if (Number(allowance) < price * Number(val) * 10 ** tokenInfo[0].decimals) {
      setApproved(false);
    } else {
      setApproved(true);
    }
  };

  const handleContribute = async () => {
    try {
      if (!walletClient || !publicClient)
        throw new Error("Wallet is not connected");
      if (!contractInstance) throw new Error("Contract error");

      const tokenInfo = getTokenInfoBySymbol(chainData.tokens, "USDC");

      if (!tokenInfo[1]) throw new Error("no USDC");

      const amount = selectedAmount.onceOff;

      await ensureTokenApproval(
        tokenInfo[1],
        price * Number(amount) * 10 ** tokenInfo[0].decimals
      );
      console.log(amount);
      const { request } = await publicClient.simulateContract({
        address: contractInstance.address as `0x${string}`,
        abi: abi.Paradise,
        functionName: "contribute",
        args: [BigInt(amount)],
        account: walletClient?.account,
        gas: BigInt(5000000),
      });
      await walletClient.writeContract(request);

      setrefreshit(!refreshit);
      // alert("Contribution successful!");
    } catch (error) {
      console.error("Error during contribution:", error);
      // alert("Contribution failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen text-black bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${herobg.src})`,
          }}
        ></div>
        <AnimatedSection>
          <div className="relative z-10 text-white text-center max-w-5xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              PARADIS3 LAND TRUST
            </h1>
            <p className="text-xl md:text-2xl">
              UNLOCK THE DOORS TO PARADISE WITH THE BLOCKCHAIN
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Welcome Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <div>
              <h2 className="text-5xl font-bold mb-8">WELCOME!</h2>
              <p className="text-lg leading-relaxed">
                Step into a new era of real estate ownership with Paradis3 Land
                Trust and become part of an exclusive collective redefining what
                it means to own land. Imagine holding a stake in a prime
                property in the tropical paradise of Belize—accessible,
                innovative, and designed for the future.
              </p>
              <p className="text-lg leading-relaxed mt-4">
                Through cutting-edge fractionalized NFTs, we're breaking down
                barriers to property ownership, making it possible for
                visionaries like you to claim your place as a landowner in one
                of the world's most beautiful and promising locations.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="relative h-[400px] bg-transparent  rounded-lg overflow-hidden">
              {/* <img
                src={img.src}
                alt="Welcome to Paradise"
                className="w-full h-full object-contain rounded-2xl"
              /> */}
               <div className="w-42 h-42 bg-transparent mx-auto mb-4 rounded-lg overflow-hidden">
                  <video src={welcome} autoPlay controls loop muted playsInline className="w-full h-full object-cover" />
                </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Secret Beach Section */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection delay={0.2}>
            <div className="relative object-contain h-[400px] bg-transparent md:order-2 rounded-lg overflow-hidden">
              <img src={beach.src} alt="" />
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="md:order-1">
              <h2 className="text-5xl font-bold mb-8">SECRET BEACH</h2>
              <p className="text-lg leading-relaxed">
                NESTLED ON THE STUNNING ISLAND OF AMBERGRIS CAYE, SECRET BEACH
                IS ONE OF BELIZE'S FASTEST-GROWING TOURIST HOTSPOTS. KNOWN FOR
                ITS CRYSTAL-CLEAR TURQUOISE WATERS, PRISTINE WHITE SAND, AND
                VIBRANT LOCAL CULTURE, IT ATTRACTS TRAVELERS SEEKING A SLICE OF
                PARADISE.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <div>
              <h2 className="text-5xl font-bold mb-8">APPROACH</h2>
              <p className="text-lg leading-relaxed">
                Belize Sunrise Our process is simple yet powerful: acquire,
                hold, and sell at the right moment. Paradis3 Land Trust
                identifies high-potential properties, like our stunning Belize
                asset, and secures ownership through a fractionalized NFT model.
                By holding the property, we plan to leverage market appreciation
                through long term market growth. At an opportune time, the
                property will be sold at full market value, maximizing returns
                for investors. This strategic approach combines patience,
                innovation, and market timing to deliver significant value and a
                seamless investment experience.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="relative h-[345px] bg-gray-200 rounded-lg overflow-hidden">
              <img src={img2.src} alt="" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* NFTs Section - Updated with funding UI */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="container mx-auto">
          <AnimatedSection>
            <h1 className="text-6xl font-bold mb-12 text-center">NFTS</h1>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection>
              <div className="border border-gray-300 p-8 rounded-lg">
                <h2 className="text-4xl font-bold mb-4">MAIN NFT</h2>
                <p className="text-xl mb-4">
                  THE MAIN NFT REPRESENTS 49% OWNERSHIP OF PROPERTY IN BELIZE, TO BE SOLD AT A LATER DATE
                </p>
                <div className="w-42 h-42 bg-transparent mx-auto mb-4 rounded-lg overflow-hidden">
                  <video src={passport} autoPlay controls loop muted playsInline className="w-full h-full object-cover" />
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="border border-gray-300 p-8 rounded-lg">
                <h2 className="text-4xl font-bold mb-4">FRACTALS</h2>
                <p className="text-xl mb-4">
                  98 FRACTALS REPRESENTING 0.5% OF THIS NFT CAN BE PURCHASED FOR $1050.00 USD
                </p>
                <div className="w-42 h-42 bg-transparent mx-auto mb-4 rounded-lg overflow-hidden">
                  <img src={fractals.src || "/placeholder.svg"} alt="" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-md">
          <AnimatedSection>
            <div className="border border-gray-300 rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold mb-2">One-Off Package</h2>
              <p className="text-4xl font-bold mb-4">1050 USDC</p>
              <p className="text-gray-600 mb-6">Available: 30</p>

              <div className="space-y-4 mb-8 text-left">
                <p className="flex items-center justify-center">
                  Short term funding
                </p>
                <p className="flex items-center justify-center">
                  Funds allocated to furnishing the house
                </p>
                <p className="flex items-center justify-center">
                  Initial capital paid back within six months
                </p>
                <p className="flex items-center justify-center">
                  Profit share distributed as a once-off
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm mb-2">
                    Your Contribution: {userContributions.onceOff}
                  </p>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md text-center"
                    placeholder="0"
                    min="0"
                    max="60"
                    value={selectedAmount.onceOff}
                    onChange={(e) => {
                      // useEffect(() => {
                      //   fetchUserContributions();
                      // }, [address, refreshit]);
                      // // console.log(address);
                      // const fetchUserContributions = async () => {

                      checkApproval(Number(e.target.value));

                      setSelectedAmount((prev) => ({
                        ...prev,
                        ["onceOff"]: e.target.value,
                      }));
                    }}
                  />
                </div>
                <p className="text-sm">
                  You will pay:{" "}
                  {Number(
                    Number(selectedAmount.onceOff) * 1050
                  ).toLocaleString()}{" "}
                  USDC
                </p>
                <Button
                  className="w-full bg-black text-white hover:bg-gray-800"
                  onClick={() => handleContribute()}
                >
                  {Approved ? "SELECT PACKAGE" : "APPROVE USDC"}
                </Button>
                <br /> <br />
                Disclaimer: After you purchase a package, join Paradis3's
                discord and open a support ticket. After you've opened a support
                ticket, provide the team with proof by submitting the payment
                transaction, and the Paradis3 team will airdrop you the NFT(s).
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Belize is Booming Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <AnimatedSection>
            <h1 className="text-6xl font-bold mb-12 text-center">
              BELIZE IS BOOMING!
            </h1>
          </AnimatedSection>
          <div className="space-y-12">
            <AnimatedSection>
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  FACTORS CONTRIBUTING TO GROWTH
                </h2>
                <p className="text-xl mb-4">
                  BELIZE'S REAL ESTATE MARKET IS BOOMING DUE TO A COMBINATION OF
                  FACTORS, INCLUDING A GROWING TOURISM INDUSTRY, INTERNATIONAL
                  INTEREST, AND THE COUNTRY'S NATURAL BEAUTY
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    TOURISM: BELIZE'S NATURAL WONDERS, LIKE THE BELIZE BARRIER
                    REEF AND ANCIENT MAYA RUINS, ATTRACT GLOBAL ATTENTION AND
                    BOOST THE APPEAL OF LOCAL REAL ESTATE.
                  </li>
                  <li>
                    INTERNATIONAL INTEREST: BELIZE IS BECOMING MORE PROMINENT ON
                    THE INTERNATIONAL STAGE, WHICH HAS LED TO A SURGE IN DEMAND
                    FROM INTERNATIONAL BUYERS.
                  </li>
                  <li>
                    AFFORDABILITY: COMPARED TO OTHER CARIBBEAN MARKETS, BELIZE'S
                    REAL ESTATE IS STILL RELATIVELY AFFORDABLE, MAKING IT AN
                    ATTRACTIVE OPTION FOR INVESTORS.
                  </li>
                </ul>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  EARLY ADOPTION PAYS OFF!
                </h2>
                <h3 className="text-2xl font-bold mb-2">AMBERGRIS CAYE</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    THE LARGEST ISLAND IN BELIZE, AMBERGRIS CAYE HAS BECOME A
                    TOP DESTINATION FOR REAL ESTATE INVESTORS.
                  </li>
                  <li>
                    LAND VALUES IN THIS AREA HAVE INCREASED AT A DOUBLE-DIGIT
                    ANNUAL RATE OVER THE LAST FOUR YEARS.
                  </li>
                </ul>
                <h3 className="text-2xl font-bold mt-4 mb-2">SECRET BEACH</h3>
                <ul className="list-disc list-inside">
                  <li>
                    EARLY INVESTORS IN SECRET BEACH ARE ALREADY SEEING THEIR
                    PROPERTIES INCREASE IN VALUE AS THE AREA DEVELOPS.
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Growth Potential Section */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="container mx-auto">
          <AnimatedSection>
            <h1 className="text-6xl font-bold mb-12 text-center">
              GROWTH POTENTIAL
            </h1>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-12">
            <AnimatedSection>
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  DEVELOPMENT TIMELINE
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    2010: SUBDIVISION OF LOTS BEGAN, MAKING LAND PARCELS
                    AVAILABLE FOR SALE.
                  </li>
                  <li>
                    2012: ESTABLISHMENT OF THE EAST TO WEST ROAD CONNECTION,
                    ENHANCING ACCESSIBILITY TO SECRET BEACH.
                  </li>
                  <li>
                    2014: INCREASED AWARENESS AND INITIAL SIGNS OF DEVELOPMENT
                    IN THE AREA.
                  </li>
                  <li>
                    2016: PAVING OF NORTHERN PORTIONS OF THE ROAD BY THE
                    GOVERNMENT, FURTHER IMPROVING INFRASTRUCTURE.
                  </li>
                  <li>
                    2017: THE TERM "SECRET BEACH" WAS POPULARIZED, ATTRACTING
                    MORE ATTENTION TO THE REGION.
                  </li>
                  <li>
                    2018: SIGNIFICANT SPIKE IN COMMERCIAL AND RESIDENTIAL
                    DEVELOPMENT, INDICATING GROWING INVESTMENT INTEREST.
                  </li>
                  <li>
                    2019: EXPANSION OF DEVELOPMENT INTO INLAND AREAS OFF THE
                    BEACH, REFLECTING INCREASING DEMAND.
                  </li>
                  <li>
                    2021: INTRODUCTION OF NEW ROAD INFRASTRUCTURE EXTENDING
                    SOUTH FROM SECRET BEACH ALONG THE WEST COAST, SUPPORTING
                    FURTHER GROWTH.
                  </li>
                </ul>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  LAND VALUE APPRECIATION
                </h2>
                <div className="w-full h-[450px] bg-gray-300 mb-4 rounded-lg overflow-hidden">
                  <img src={graph.src} alt="" />
                </div>
                <p className="text-xl">
                  Secret Beach, located on Ambergris Caye in Belize, has
                  experienced significant growth and development over the past
                  decade, leading to notable appreciation in land values. While
                  comprehensive year-by-year data is limited, available
                  information highlights key trends and milestones in the area's
                  real estate market.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="min-h-screen flex flex-col items-center justify-center lg:mt-10 md:flex-row bg-white text-black">
        <AnimatedSection>
          <div className="md:w-1/6 flex flex-col items-center justify-center p-4 md:p-0">
            <div className="text-6xl font-bold" style={{ textAlign: "center" }}>
              CONTACT US
            </div>
            <div className="flex mt-4 space-x-4">
              <Link
                href="https://x.com/paradis3rwa"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center"
              >
                <FaTwitter className="h-8 w-8" />
              </Link>
              <Link
                href="https://discord.gg/vrDTYY2S"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center"
              >
                <FaDiscord className="h-8 w-8" />
              </Link>
              <Link
                href="https://paradis3.io"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center"
              >
                <FaGlobe className="h-8 w-8" />
              </Link>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="flex-grow flex items-center justify-center p-4 md:p-8">
            <div className="w-full h-full min-h-[400px] bg-gray-200 rounded-lg overflow-hidden">
              {/* Placeholder for the custom image */}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="md:w-1/3 flex flex-col justify-center p-4 md:p-8">
            <h2 className="text-3xl font-bold mb-8">TRUSTEES</h2>
            <ul className="space-y-6">
              {[
                { name: "ERIC MARCANO JR", email: "ERICMARCANOCC@GMAIL.COM" },
                { name: "DANIEL ZANDBERG", email: "DZANDBERG11@GMAIL.COM" },
                { name: "ELIRAN ZLIHA", email: "ELIRANZLIHA@GMAIL.COM" },
                { name: "CORY MARTINO", email: "CORYMARTINO1989@GMAIL.COM" },
                { name: "TREVOR WEAVER", email: "TJWEAVER1990@GMAIL.COM" },
              ].map((trustee, index) => (
                <motion.li
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Linkedin className="w-6 h-6 mr-4" />
                  <div>
                    <h3 className="text-xl font-bold">
                      {trustee.name} - TRUSTEE
                    </h3>
                    <p className="text-sm">{trustee.email}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-black text-white">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Invest in Paradise?
            </h2>
            <p className="text-xl mb-8">
              Join the future of property ownership today.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              Get Started
            </Button>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
