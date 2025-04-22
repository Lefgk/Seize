"use client";

import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import abi from "@/config/abi";
import { chains } from "@/config/chains";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaChartBar,
  FaEthereum,
  FaHandHoldingUsd,
  FaProjectDiagram,
  FaShieldAlt,
  FaTools,
  
  FaUserTie,
  FaUsers,
} from "react-icons/fa";
import { FaChartLine, FaLock } from "react-icons/fa6";
import { HiArrowRight } from "react-icons/hi";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { createPublicClient, getContract, http } from "viem";

const projects = [
  {
    image: "/services/egoverse.png",
    label: "EgoVersus: The First Strike",
    link: "https://seize.fund/Egoversus",
    hasContract: true,
  },
  {
    image: "/services/supernova.png",
    label: "Supernova: Project Support ",
    link: "https://seize.fund/Supernova",
  },
  {
    image: "/services/veracity.png",
    label: "Veracity",
    link: "https://seize.fund/Veracity",
  },
  {
    image: "/services/steadfast.png",
    label: "Inspire",
    link: "https://seize.fund/Steadfast",
    hasContract: true,
  },
  {
    image: "/services/bueller.png",
    label: "Built By Bueller",
    link: "https://seize.fund/BBB",
  },
  {
    image: "/services/paradise.png",
    label: "PARADIS3 LAND TRUST",
    link: "https://seize.fund/Paradise",
    hasContract: true,
  },
  {
    image: "/services/ytdev.png",
    target: "_blank",
    label: "Yash-Full-Stack-Developer",
    link: "https://discord.gg/wNwb84bP",
  },
  {
    image: "/services/utsav.gif",
    label: "Utsav: Full Stack Developer",
    link: "https://discord.gg/yck9xeB7Jp",
    target: "_blank",
  },
];

export default function Home() {
const [totalCampaigns, setTotalCampaigns] = useState<number>(0);
  const [totalRaised, setTotalRaised] = useState<number>(0);
  const [totalCampaignsByChain, setTotalCampaignsByChain] = useState<Record<string, number>>({});
  const [totalRaisedByChain, setTotalRaisedByChain] = useState<Record<string, number>>({});
  const [fromRaffle, setFromRaffle] = useState<number>(0);

const fetchStats = async () => {
    try {
      const chainStatsPromises = chains.map(async (chain) => {
        try {
          const publicClient = createPublicClient({
            chain: chain.chain,
            transport: http(),
          });

          const campaignFactory = getContract({
            address: chain.contracts.factory as `0x${string}`,
            abi: abi.Factory,
            client: publicClient,
          });

          const totalCampaigns = Number(await campaignFactory?.read.totalCampaigns() || 0);
          let totalRaised = Number(await campaignFactory?.read.getTotalRaisedinUSDC() || 0);
          let totalRaisedFromClients = 0;
          let totalRaisedFromRaffle = 0;

          if (chain.chainId === 8453) { // Base chain
            const feeCalcFactory = getContract({
              address: chain.contracts.feeCalculator,
              abi: abi.FeesCalc,
              client: publicClient,
            });
            totalRaisedFromClients = Number(await feeCalcFactory?.read.calculateTotalRaised() || 0);
          }

          if (chain.chainId !== 1329 && chain.contracts.Raffle) { // Exclude Sei
            const RaffleCa = getContract({
              address: chain.contracts.Raffle as `0x${string}`,
              abi: abi.Raffle,
              client: publicClient,
            });
            totalRaisedFromRaffle = Number(await RaffleCa?.read.totalTickets() || 0);
          }

          const usdcDecimals = Object.values(chain.tokens).find((z) => z.symbol === "USDC")?.decimals || 6;
          totalRaised = (totalRaised + totalRaisedFromClients + (totalRaisedFromRaffle * 1500000)) / Math.pow(10, usdcDecimals);

          return {
            chainId: chain.chainId,
            totalRaised: isNaN(totalRaised) ? 0 : totalRaised,
            totalCampaigns: isNaN(totalCampaigns) ? 0 : totalCampaigns,
            raffleContribution: totalRaisedFromRaffle * 1.5
          };
        } catch (chainError) {
          console.error(`Error processing chain ${chain.chainId}:`, chainError);
          return {
            chainId: chain.chainId,
            totalRaised: 0,
            totalCampaigns: 0,
            raffleContribution: 0
          };
        }
      });

      const chainStats = await Promise.all(chainStatsPromises);

      const accumulatedStats = chainStats.reduce(
        (acc, { totalRaised, totalCampaigns, raffleContribution }) => {
          acc.totalRaised += totalRaised;
          acc.totalCampaigns += totalCampaigns;
          acc.totalRaffle += raffleContribution;
          return acc;
        },
        { totalRaised: 0, totalCampaigns: 0, totalRaffle: 0 }
      );

      const chainRaised: Record<string, number> = {};
      const chainCampaigns: Record<string, number> = {};
      chainStats.forEach(({ chainId, totalRaised, totalCampaigns }) => {
        chainRaised[chainId] = totalRaised;
        chainCampaigns[chainId] = totalCampaigns;
      });

      setTotalRaisedByChain(chainRaised);
      setTotalCampaignsByChain(chainCampaigns);
      setTotalRaised(accumulatedStats.totalRaised);
      setTotalCampaigns(accumulatedStats.totalCampaigns);
      setFromRaffle(accumulatedStats.totalRaffle);

    } catch (e) {
      console.error("Error fetching stats:", e);
      setTotalRaised(0);
      setTotalCampaigns(0);
      setTotalRaisedByChain({});
      setTotalCampaignsByChain({});
      setFromRaffle(0);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <section className="py-20 px-4 md:px-8 lg:px-16 text-center">
        <div style={{ display: "flex" }}>
          <div
            // className="rounded-xl shadow-lg text-left"
            style={{ width: "30%" }}
          ></div>
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 uppercase">
              <span className="text-primary uppercase">Seize</span> your
              Opportunity
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Ignite your vision, secure backing, and cultivate a thriving
              community
            </p>
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <div className="flex flex-wrap justify-center gap-6 p-6 rounded-xl shadow-lg backdrop-blur-sm">
            <div className="flex bg-gradient-to-r from-primary/10 to-primary/20 items-center space-x-4 p-4 rounded-lg transition-all duration-300 hover:bg-default-700/60">
              <div className="bg-primary/20 p-3 rounded-full">
                <FaProjectDiagram className="text-primary h-6 w-6" />
              </div>
              <div>
                <p className="text-foreground/80 text-sm mt-2">Campaigns Created</p>
                <p className="text-3xl font-bold">
                  {!isNaN(totalCampaigns) ? (
                    totalCampaigns + projects.filter((x) => x.hasContract).length
                  ).toLocaleString("en") : 0}
                </p>
                <div className="space-y-1 mt-2">
                  {chains.map((c) => (
                    <div key={c.chainId} className="flex items-center gap-x-1 text-sm">
                      <span className="font-medium">
                        {(totalCampaignsByChain[c.chainId] || 0).toLocaleString("en")}
                      </span>
                      <Image
                        src={c.image}
                        width={16}
                        height={16}
                        className="w-4 h-4 rounded-full"
                        alt={c.name}
                      />
                      <span className="text-foreground/80">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex bg-gradient-to-r from-primary/10 to-primary/20 items-center space-x-4 p-4 rounded-lg transition-all duration-300 hover:bg-default-700/60">
              <div className="bg-primary/20 p-3 rounded-full">
                <FaChartLine className="text-primary h-6 w-6" />
              </div>
              <div>
                <p className="text-foreground/80 text-sm mt-2">Total Raised</p>
                <p className="text-3xl font-bold">
                  ${
                    !isNaN(totalRaised) ? totalRaised.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) : 0
                  }
                </p>
                <div className="space-y-1 mt-2">
                  {chains.map((c) => (
                    <div key={c.chainId} className="flex items-center gap-x-1 text-sm">
                      <span className="font-medium">
                        ${(totalRaisedByChain[c.chainId] || 0).toLocaleString("en", {
                          maximumFractionDigits: 2
                        })}
                      </span>
                      <Image
                        src={c.image}
                        width={16}
                        height={16}
                        className="w-4 h-4 rounded-full"
                        alt={c.name}
                      />
                      <span className="text-foreground/80">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex bg-gradient-to-r from-primary/10 to-primary/20 items-center space-x-4 p-4 rounded-lg transition-all duration-300 hover:bg-default-700/60">
              <div className="bg-primary/20 p-3 rounded-full">
                <FaLock className="text-primary h-6 w-6" />
              </div>
              <div>
                <p className="text-foreground/80 text-sm mt-2">Grants</p>
                <p className="text-3xl font-bold">
                  ${
                    !isNaN(totalCampaigns) ? (totalCampaigns * 15 + fromRaffle).toLocaleString(
                      undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                    ) : 0
                  }
                </p>
                <div className="space-y-1 mt-2">
                  {chains.map((c) => (
                    <div key={c.chainId} className="flex items-center gap-x-1 text-sm">
                      <span className="font-medium">
                        ${((totalCampaignsByChain[c.chainId] || 0) * 15).toLocaleString("en", {
                          maximumFractionDigits: 2
                        })}
                      </span>
                      <Image
                        src={c.image}
                        width={16}
                        height={16}
                        className="w-4 h-4 rounded-full"
                        alt={c.name}
                      />
                      <span className="text-foreground/80">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="flex justify-center mt-5 gap-4 flex-wrap">
          <Link href={"/campaigns"}>
            <Button
              size="lg"
              className="bg-primary group/btn hover:bg-primary-light font-semibold text-primary-foreground"
            >
              Fund Campaigns{" "}
              <HiArrowRight className="ml-2 h-5 w-5 transition-all ease-in duration-100 group-hover/btn:translate-x-1" />
            </Button>
          </Link>

          <Link href={"/campaigns/create"}>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-light group/btn font-semibold text-primary-foreground"
            >
              Start Campaign{" "}
              <HiArrowRight className="ml-2 h-5 w-5 transition-all ease-in duration-100 group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>

        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlay
          autoPlaySpeed={3000}
          centerMode={false}
          className=""
          containerClass="container-with-dots mt-8"
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          pauseOnHover
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024,
              },
              items: 5,
              partialVisibilityGutter: 40,
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0,
              },
              items: 1,
              partialVisibilityGutter: 30,
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 464,
              },
              items: 2,
              partialVisibilityGutter: 30,
            },
          }}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          showDots={false}
          sliderClass=""
          slidesToSlide={1}
          swipeable
        >
          {projects.map((project, index) => (
            <div key={index} className="px-2 h-fit">
              <a href={project.link} {...project}>
                <div className="!bg-default-800 hover:!bg-default-700 cursor-pointer h-full rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={project.image}
                    alt={project.label}
                    className="w-full h-48"
                    imgClassName="object-cover w-full h-full"
                  />
                  <div className="p-4 flex justify-center items-center gap-2">
                    <h3 className="text-lg font-semibold text-center">
                      {project.label}
                    </h3>
                    <div className="flex gap-2 items-center">
                      {project.hasContract && (
                        <Image
                          src="/chains/base.png"
                          className="w-7 h-7 overflow-hidden rounded-full"
                        />
                      )}

                      {project.hasContract &&
                        project.label == "PARADIS3 LAND TRUST" && (
                          <Image
                            src="/chains/avax.png"
                            className="w-7 h-7 overflow-hidden rounded-full"
                          />
                        )}
                      {project.hasContract &&
                        project.label != "PARADIS3 LAND TRUST" && (
                          <Image
                            src="/services/llc.png"
                            className="w-7 h-7 overflow-hidden rounded-full"
                          />
                        )}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </Carousel>
      </section>

      <section className="py-16 px-4 md:px-8 lg:px-16 bg-default-800/30">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Why Choose Seize?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FaEthereum,
              title: "Flexible Funding",
              description: "Funding options tailored to your needs",
            },
            {
              icon: FaTools,
              title: "Powerful Tools",
              description: "Campaign customization tools at your fingertips",
            },
            {
              icon: FaUserTie,
              title: "Expert Guidance",
              description: "Campaign strategists to guide your journey",
            },
            {
              icon: FaChartBar,
              title: "Real-time Analytics",
              description: "Track your progress with detailed insights",
            },
            {
              icon: FaUsers,
              title: "Vibrant Community",
              description: "Supporters and fellow innovators",
            },
            {
              icon: FaShieldAlt,
              title: "Secure Funding",
              description:
                "Audited by Veracity. High level security audits for Web3 dApps",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-default-900 p-6 rounded-lg shadow-lg transform transition-transform duration-300"
            >
              <div className="flex items-center mb-4">
                <feature.icon className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex flex-col md:flex-row items-center gap-5 justify-between">
          <div className="flex justify-center">
            <div className="relative w-64 h-64 bg-primary/20 rounded-full flex items-center justify-center">
              <FaHandHoldingUsd className="text-primary w-32 h-32" />
            </div>
          </div>

          <div className="mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Creator Grant Fund
            </h2>
            <p className="text-xl mb-6">
              At our crowdfunding platform, we believe in supporting our
              creators beyond just providing a launchpad. That's why we're
              excited to announce our Creator Grant Fund—a community-driven
              initiative designed to give back and help projects succeed.
            </p>
            <Link href="/grant">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-light group/btn font-semibold text-primary-foreground"
              >
                Know More{" "}
                <HiArrowRight className="ml-2 h-5 w-5 transition-all ease-in duration-100 group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
