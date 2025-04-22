"use client";

import { Button } from "@/components/ui/button";
import abi from "@/config/abi";
import { chains } from "@/config/chains";
import { ArrowRight, CheckCircle, DollarSign } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa6";
import { createPublicClient, getContract, http } from "viem";

export default function GrantPage() {
  const [grants, setGrants] = useState<number>(0);

  const fetchGrants = async () => {
    try {
      const chainStatsPromises = chains.map(async (chain) => {
        const publicClient = createPublicClient({
          chain: chain.chain,
          transport: http(),
        });

        const campaignFactory = getContract({
          address: chain.contracts.factory as `0x${string}`,
          abi: abi.Factory,
          client: publicClient,
        });
        const totalCampaigns = await campaignFactory?.read.totalCampaigns();

        return {
          totalCampaigns: Number(totalCampaigns),
        };
      });

      const chainStats = await Promise.all(chainStatsPromises);

      const accumulatedStats = chainStats.reduce(
        (acc, { totalCampaigns }) => {
          acc.totalCampaigns += totalCampaigns;
          return acc;
        },
        { totalCampaigns: 0 }
      );

      setGrants(Number(accumulatedStats.totalCampaigns) * 15);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchGrants();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <main className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Creator Grant Fund
          </h1>
          <p className="text-xl text-foreground">
            Supporting creators beyond the launchpad
          </p>

          <div className="w-fit mt-5 mx-auto px-8 flex bg-gradient-to-r from-primary/10 to-primary/20  items-center space-x-4 p-4 rounded-lg transition-all duration-300 hover:bg-default-700/60">
            <div className="bg-primary/20 p-3 rounded-full">
              <FaLock className="text-primary h-6 w-6" />
            </div>
            <div>
              <p className="text-3xl font-bold">
                $
                {grants.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-foreground/80 text-sm">Grants</p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card
              title="$15 Campaign Creation Fee"
              description="Each time a new campaign is launched, the entire $15 creation fee goes directly into our Creator Grant Fund."
              icon={<DollarSign className="w-8 h-8 text-primary" />}
            />
            <Card
              title="Growing the Pot"
              description="With every new campaign, the grant fund grows, creating a pool of money dedicated to supporting standout projects."
              icon={<ArrowRight className="w-8 h-8 text-primary" />}
            />
            <Card
              title="Grant Distribution"
              description="Every six months, we distribute the accumulated funds to selected projects, offering multiple grants to help creators bring their ideas to life."
              icon={<CheckCircle className="w-8 h-8 text-primary" />}
            />
          </div>
        </section>

        <section className="rounded-2xl shadow-xl bg-default-800 p-8">
          <h2 className="text-2xl font-semibold mb-6">Grant Distribution</h2>
          <Timeline />
        </section>

        <section className="bg-default-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Eligibility and Application
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Open to all creators with an active campaign on our platform.
            </li>
            <li>
              Campaigns must have reached at least 65% of their funding goal to
              apply.
            </li>
            <li>
              Simply fill out a brief application explaining how the grant would
              help your project.
            </li>
          </ul>
        </section>

        <section className="bg-default-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Transparency and Community Involvement
          </h2>
          <p className="text-foreground mb-4">
            We provide real-time updates on the size of the grant fund on our
            platform.
          </p>
          <p className="text-foreground">
            Community Voting: Backers may get a chance to vote on which projects
            should receive a grant.
          </p>
        </section>

        <section className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-pretty">
            Join Us in Supporting Creativity
          </h2>
          <p>
            By launching your campaign with us, you're not just funding your own
            dream—you're contributing to a fund that helps others do the same.
            Together, we're building a stronger community of creators.
          </p>
          <Link href={"https://discord.gg/cUMSB2J6TU"}>
            <Button>Apply for Grant</Button>
          </Link>
        </section>
      </main>
    </div>
  );
}

function Card({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-default-800/80 rounded-xl p-6 flex flex-col items-center text-center">
      <div className="p-3 bg-primary/40 rounded-full">{icon}</div>
      <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
        {title}
      </h3>
      <p className="text-foreground">{description}</p>
    </div>
  );
}

function Timeline() {
  return (
    <div className="space-y-4">
      <TimelineItem
        title="Quarterly Grants"
        description="Every three months, we distribute the accumulated funds to selected projects, offering multiple grants to help creators bring their ideas to life."
      />
      <TimelineItem
        title="Grant Amounts"
        description="Depending on the size of the fund, we offer several smaller grants or one larger grant per cycle."
      />
    </div>
  );
}

function TimelineItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex">
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
