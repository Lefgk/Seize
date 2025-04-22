"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import dining from "@/Images/DiningRoom.webp";
import Kitchen from "@/Images/Thekitchen.webp";
import FamilyRoom from "@/Images/Family.webp";
import Pool from "@/Images/pool_files/11.-pool-area.jpg";
import welcome1 from "@/Images/Sober Living_files/img_20241102_115357753.jpg";
import welcome2 from "@/Images/Sober Living_files/img-20240722-wa0105.jpg";
import welcome3 from "@/Images/Sober Living_files/pexels-markusspiske-113335.jpg";
import aboutimg from "@/Images/aboutimgsteadfast.jpg";
import gallery1 from "@/Images/FrontOfHouses.webp";
import Lounge from "@/Images/Lounge.webp";
import gallery2 from "@/Images/GardenPath_files/104001.jpeg";
import gallery3 from "@/Images/GardenPath2.webp";
import gallery4 from "@/Images/GardenPath3.webp";
import gallery5 from "@/Images/FrontEntrance_files/104003.jpeg";
import gallery6 from "@/Images/Fred.webp";
import gallery7 from "@/Images/TheReadingCorner.webp";
// import contracts from "../../constants/contracts.js";
import abi from "@/config/abi";
import { useChainData } from "@/hooks/useChainData";
import { useSteadFastContract } from "@/hooks/useCampaignFactory";
import { useAccount, useClient, usePublicClient, useWalletClient } from "wagmi";
import { getContract } from "viem";
import logo from "@/Images/doogs.webp";

// Main Page Component
export default function Page() {
  const { address } = useAccount();
  const contractInstance = useSteadFastContract();
  const client = useClient();
  const chainData = useChainData();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient({ chainId: chainData.chainId });
  // const [Approved0, setApproved0] = useState(false);
  const [Approved1, setApproved1] = useState(false);
  const [packageData, setPackageData] = useState({
    onceOffAvailable: 100,
    allInAvailable: 20,
  });
  const [userContributions, setUserContributions] = useState({
    onceOff: "",
    allIn: "",
  });

  // type SelectedAmount = {
  //   // onceOff: number;
  //   allIn: number;
  // };

  const [selectedAmount, setSelectedAmount] = useState(0);
  const [refreshit, setrefreshit] = useState(false);

  useEffect(() => {
    fetchUserContributions();
  }, [address, refreshit]);
  // console.log(address);
  const fetchUserContributions = async () => {
    try {
      if (!contractInstance) throw new Error("Contract not found");
      if (!address) throw new Error("Not connected");
      const onceOffContributions =
        await contractInstance.read.tier1Contributions([address]);

      // console.log(onceOffContributions);
      const allInContributions = await contractInstance.read.tier2Contributions(
        [address]
      );

      // console.log(allInContributions);
      setUserContributions({
        onceOff: onceOffContributions.toString(),
        allIn: allInContributions.toString(),
      });
      const onceOffAvailable =
        await contractInstance.read.totalTier1Contributors();

      const allInAvailable =
        await contractInstance.read.totalTier2Contributors();

      setPackageData({
        onceOffAvailable: Number(onceOffAvailable),
        allInAvailable: Number(allInAvailable),
      });
    } catch (error) {
      console.error("Error fetching user contributions:", error);
    }
  };

  const checkApproval = async (val: number, id: number) => {
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
    // console.log(
    //   Number(allowance),
    //   (id === 0 ? 100 : 500) * Number(val) * 10 ** tokenInfo[0].decimals
    // );
    if (
      Number(allowance) <
      (id === 0 ? 100 : 500) * Number(val) * 10 ** tokenInfo[0].decimals
    ) {
      // if (id === 0) {
      //   setApproved0(false);
      // } else {
      setApproved1(false);
      // }
    } else {
      // if (id === 0) {
      //   setApproved0(true);
      // } else {
      setApproved1(true);
      // }
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

  const handleContribute = async (packageType: string) => {
    try {
      if (!walletClient || !publicClient)
        throw new Error("Wallet is not connected");
      if (!contractInstance) throw new Error("Contract error");

      const tokenInfo = getTokenInfoBySymbol(chainData.tokens, "USDC");

      if (!tokenInfo[1]) throw new Error("no USDC");
      const packageId = packageType === "onceOff" ? 1 : 2;

      let amount = 0;
      // if (packageId == 1) {
      //   amount = selectedAmount.onceOff;
      // } else {
      amount = selectedAmount;
      // }

      const price = packageType === "onceOff" ? 100 : 500;
      await ensureTokenApproval(
        tokenInfo[1],
        price * amount * 10 ** tokenInfo[0].decimals
      );

      const { request } = await publicClient.simulateContract({
        address: contractInstance.address as `0x${string}`,
        abi: abi.SteadFast,
        functionName: "contribute",
        args: [Number(packageId), BigInt(amount)],
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
    <div className="relative min-h-screen bg-white">
      {/* Header with Connect Wallet */}
      {/* <div className="fixed left-0 right-0 top-0 z-50 flex h-20 items-center border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto flex max-w-screen-xl items-center justify-between px-4">
          <Image
            src="/placeholder.svg?height=40&width=40&text=SEIZE"
            alt="SEIZE Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <ConnectWallet />
        </div>
      </div> */}

      {/* Hero Section */}
      <section className="relative h-screen">
        <HeroSlider images={heroImages} />
        <div className="absolute inset-0 flex items-center justify-center bg-[#00843D]/40">
          <div className="flex container mx-auto max-w-screen-xl px-4 text-center">
            <div>
              <Image
                src={logo.src}
                alt="Logo"
                width={100}
                height={100}
                className="w-20 h-20 mx-4 rounded-md"
              />
            </div>
            <h1 className="text-5xl font-light tracking-tight text-white md:text-7xl">
              Start your journey to sober living here
            </h1>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto max-w-screen-xl px-4 ">
          <h2 className="mb-12 text-4xl font-light text-[#00843D]">ABOUT US</h2>
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-6 text-gray-600">
              <p className="text-lg leading-relaxed">
                We believe in the power of community, hope and second chances.
                Our mission is to provide a safe and supportive environment for
                individuals in recovery from addiction.
              </p>
              <p className="text-lg leading-relaxed">
                We understand that the path to sobriety is a journey, whether
                you&apos;re transitioning from treatment or rebuilding your life
                after setbacks, our privately owned sober home offers a peaceful
                space to help you focus on your growth and well-being.
              </p>
              <p className="text-lg leading-relaxed">
                With a network of compassionate professionals and peers who
                understand your struggles, you&apos;ll be empowered to create a
                healthy, fulfilling future.
              </p>
              <p className="text-lg leading-relaxed">
                We celebrate every step forward and honour the resilience of
                those who choose to heal. Here, you'll find not just a roof over
                your head, but a supportive community dedicated to your
                long-term success in recovery.
              </p>
              {/* <a
                href="https://soberliving.doogs.co.za/about-page/"
                className="mt- bg-[#00843D] text-white hover:bg-[#00843D]/90 py-2.5 rounded-lg px-5  "
              >
                Learn more
              </a> */}
            </div>
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={aboutimg}
                alt="Our facility"
                width={800}
                height={600}
                className="h-[550px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-[#004B87] py-24">
        <div className="container mx-auto max-w-screen-xl px-4">
          <h2 className="mb-12 text-center text-4xl font-light text-white">
            GALLERY
          </h2>
          <ImageGallery images={galleryImages} />
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto max-w-screen-xl px-4">
          <h2 className="mb-12 text-center text-4xl font-light text-[#00843D]">
            What we offer
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Structured environment",
                description:
                  "Living in our sober home provides a structured and consistent routine, which is crucial for maintaining sobriety. Our daily schedule includes healthy activities, that promote health and accountability, with regular check-ins with a focus on recovery goals. This structure minimizes triggers and temptations, paving the way for success.",
              },
              {
                title: "Peer support",
                description:
                  "One of the most powerful aspects of sober living is the sense of community. You'll be surrounded by individuals who are on a similar journey to recovery. Sharing experiences, challenges, and victories with others who truly understand your struggles fosters deep connections and creates a lifetime support network that strengthens recovery.",
              },
              {
                title: "Accountability and responsibility",
                description:
                  "Sobriety is about more than just abstaining from substances; it's also about rebuilding trust and accountability. We encourage personal responsibility, whether it's maintaining your living space, following house rules, or participating in group activities. This sense of accountability is key to personal growth and long-term recovery.",
              },
              {
                title: "Safe and Substance-Free Environment",
                description:
                  "Our home provides a safe, substance-free environment where individuals can heal without the distractions or temptations of drugs and alcohol. This clean, calm space allows you to focus on your recovery, develop healthy habits, and practice self-care in a supportive environment.",
              },
              {
                title: "Emotional and Mental Health Support",
                description:
                  "Recovery isn't just physical – it's emotional and mental, too. Residents benefit from peer-led emotional support groups and have access to professional counselling to address issues like anxiety, depression, and trauma, which often accompany addiction. We prioritise mental resilience alongside physical sobriety.",
              },
              {
                title: "Relapse Prevention Focus",
                description:
                  "Preventing relapse is a cornerstone of our approach. Residents receive education and strategies to identify triggers, manage cravings, and develop coping skills. We work closely with each resident to build a personalised plan for sustainable recovery beyond their stay with us.",
              },
            ].map((service, index) => (
              <Card key={index} className="border-none bg-[#E6EEF4]">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-[#004B87]">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign Section */}
      <section className="bg-[#E6EEF4] py-24">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-12 text-4xl font-light text-[#004B87]">
              Support Our Vision
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  title: "All-In Package",
                  price: "500 USDC",
                  Available: 20 - packageData.allInAvailable,
                  features: [
                    "Long term funding",
                    "Funds allocated to working capital",
                    "Initial capital paid back within twelve months",
                    "Profit share will be distributed every year",
                  ],
                },
              ].map((pkg, index) => (
                <Card key={index} className="border-none bg-white">
                  <CardHeader>
                    <CardTitle className="flex flex-col gap-2">
                      <span className="text-2xl font-light text-[#004B87]">
                        {pkg.title}
                      </span>
                      <span className="text-4xl font-light text-[#00843D]">
                        {pkg.price}
                      </span>
                      {index == 1 ? (
                        <span className="text-sm text-gray-500">
                          Funding complete !{" "}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Available: {pkg.Available}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="mb-6 space-y-2 text-gray-600">
                      {pkg.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                    {index == 0 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">
                            Your Contributions: {userContributions.allIn}
                          </p>
                          <Input
                            className=""
                            type="number"
                            placeholder="Enter quantity"
                            min="1"
                            value={selectedAmount}
                            onChange={(e) => {
                              checkApproval(Number(e.target.value), index);
                              setSelectedAmount(Number(e.target.value));
                            }}
                            style={{ color: "white" }}
                          />
                          <p className="text-sm text-gray-500">
                            You will pay:{" "}
                            {(Number(selectedAmount) * 500).toLocaleString()}{" "}
                            USDC
                          </p>
                        </div>
                        {index == 0 && (
                          <Button
                            className="w-full bg-[#00843D] text-white hover:bg-[#00843D]/90"
                            onClick={() => handleContribute("allIn")}
                          >
                            {Approved1 == true
                              ? "Select Package"
                              : "APPROVE USDC"}{" "}
                            {/* {index} */}
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto max-w-screen-xl px-4 text-center">
          <h2 className="mb-12 text-4xl font-light text-[#00843D]">
            Learn how WE can support your recovery journey
          </h2>
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-gray-600">
            {/* <p className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#00843D]" />
              239 Stead Ave, Queenswood, Pta, 0186
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-[#00843D]" />
              083 784 4224
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#00843D]" />
              soberliving@doogs.co.za
            </p> */}
            {/* <div className="mt-4 flex gap-4">
              <Link
                href="https://facebook.com"
                className="text-[#00843D] hover:text-[#00843D]/80"
              >
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href="https://instagram.com"
                className="text-[#00843D] hover:text-[#00843D]/80"
              >
                <Instagram className="h-6 w-6" />
              </Link>
            </div> */}
            <Link
              href="https://discord.gg/GzQEpTAStv"
              target="_blank"
              className="mt-8 inline-flex items-center rounded-md bg-[#00843D] px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-[#00843D]/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Types
interface HeroSliderProps {
  images: StaticImageData[]; // Replace 'any[]' with proper type
  interval?: number;
}

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
    caption: string;
  }[];
  className?: string;
}

// Components
// function ConnectWallet() {
//   const [isConnected, setIsConnected] = useState(false)

//   const handleConnect = () => {
//     setIsConnected(true)
//     // Add wallet connection logic here
//   }

//   return (
//     <Button
//       onClick={handleConnect}
//       variant="outline"
//       className="border-white/20 text-white hover:bg-white hover:text-black"
//     >
//       <Wallet className="mr-2 h-4 w-4" />
//       {isConnected ? 'Connected' : 'Connect Wallet'}
//     </Button>
//   )
// }

function HeroSlider({ images, interval = 5000 }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {images.map((image, index) => (
        <div
          key={`hero-${index}`}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="relative h-full w-full">
            <Image
              src={image}
              alt={`Hero image ${index + 1}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        </div>
      ))}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-1.5 w-12 rounded-full transition-all",
              index === currentIndex ? "bg-white" : "bg-white/30"
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

function ImageGallery({ images, className }: ImageGalleryProps) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-4", className)}>
      {images.map((image, index) => (
        <div key={index} className="group relative overflow-hidden rounded-lg">
          <Image
            src={image.src}
            alt={image.alt}
            width={800}
            height={600}
            className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            priority={index < 4}
            loading={index >= 4 ? "lazy" : undefined}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="absolute bottom-4 left-4 text-lg font-light text-white">
            {image.caption}
          </p>
        </div>
      ))}
    </div>
  );
}

// Data
const heroImages = [welcome1, welcome2, welcome3];

const galleryImages = [
  {
    src: gallery1.src || "",
    alt: "Front of House",
    caption: "Front of House",
  },
  {
    src: gallery2.src || "",
    alt: "Hydrangea in Front",
    caption: "Hydrangea in Front",
  },
  {
    src: gallery3.src || "",
    alt: "Garden Path",
    caption: "Garden Path",
  },
  {
    src: gallery4.src || "",
    alt: "Garden Path",
    caption: "Garden Path",
  },
  {
    src: gallery5.src || "",
    alt: "Garden Path",
    caption: "Garden Path",
  },
  {
    src: gallery6.src || "",
    alt: "Fred",
    caption: "Fred",
  },
  {
    src: gallery7.src || "",
    alt: "The Reading Corner",
    caption: "The Reading Corner",
  },
  {
    src: Lounge.src || "",
    alt: "Lounge",
    caption: "Lounge",
  },
  {
    src: dining.src || "",
    alt: "Dining Room",
    caption: "Dining Room",
  },
  {
    src: Kitchen.src || "",
    alt: "The Kitchen",
    caption: "The Kitchen",
  },
  {
    src: FamilyRoom.src || "",
    alt: "Family Meeting Room",
    caption: "Family Meeting Room",
  },
  {
    src: Pool.src || "",
    alt: "Pool Area",
    caption: "Pool Area",
  },
].filter((image) => image.src);
