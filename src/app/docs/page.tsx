"use client";

import { useState } from "react";
import { FaBook, FaRocket, FaCogs, FaBullhorn, FaGift } from "react-icons/fa";
import { Sidebar } from "@/components/pages/docs/Sidebar";
import { TopTabs } from "@/components/pages/docs/TopTabs";
import { RiContractLine } from "react-icons/ri";
import { chains } from "@/config/chains";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const pageContent = [
  {
    icon: <FaBook />,
    title: "Seize: The Ultimate Crowdsourcing Solution",
    content: (
      <>
        <h3 className="text-xl font-semibold mb-3">Introduction</h3>
        <p className="mb-4">
          Seize aims to revolutionize the crowdsourcing industry by connecting
          individuals and businesses in need of funds with those who have the
          means to invest. Our platform is designed to cater to a wide array of
          financial needs, from personal loans to small business funding, making
          it the go-to solution for anyone seeking financial assistance.
        </p>
        <p className="mb-4">
          By leveraging blockchain technology, Seize offers flexibility and
          security, allowing users to navigate various regulations and access
          funding in a more efficient manner.
        </p>
        <p className="mb-4">
          Our vision is to create a community-driven platform where financial
          needs meet available resources, empowering users to achieve their
          goals and improve their financial situations. Whether you&apos;re an
          individual facing a short-term financial crunch or a startup seeking
          to scale, Seize will provide the infrastructure necessary to
          facilitate these transactions securely and transparently.
        </p>
      </>
    ),
  },
  {
    icon: <RiContractLine />,
    title: "Campaign Factory",
    content: (
      <>
        <ol className="list-decimal list-inside mb-4">
          <Table>
            <TableHeader className="whitespace-nowrap">
              <TableRow>
                <TableHead className="w-[200px]">Chain Name</TableHead>
                <TableHead>Contract Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="whitespace-nowrap">
              {chains.map((chain) => (
                <TableRow key={chain.name}>
                  <TableCell className="font-medium">{chain.name}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {chain.contracts.factory}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ol>
      </>
    ),
  },
  {
    icon: <FaRocket />,
    title: "Mission Statement",
    content: (
      <>
        <p className="mb-4">Seize stands by a few basic principles:</p>
        <ul className="list-disc list-inside mb-4">
          <li>We don&apos;t get paid until you get paid.</li>
          <li>If you don&apos;t get paid, neither do we.</li>
          <li>
            We will do everything in our power to push our platform, you do the
            same for your campaign.
          </li>
          <li>Together we are strong, alone we are nothing.</li>
          <li>Many hands makes light work.</li>
          <li>Communication is key.</li>
          <li>Provide and be provided.</li>
        </ul>
      </>
    ),
  },
  {
    icon: <FaCogs />,
    title: "How to Invest",
    content: (
      <>
        <ol className="list-decimal list-inside mb-4">
          <li className="mb-2">
            <strong>Connect Your Crypto Wallet:</strong> To begin your
            investment journey, connect the crypto wallet of your choice to the
            Seize platform. This will allow you to manage your transactions
            seamlessly and securely.
          </li>
          <li className="mb-2">
            <strong>Choose Your Tier of Investment:</strong> Once your wallet is
            connected, select the investment tier that best suits your financial
            goals and risk appetite. Each tier will provide different levels of
            involvement and potential returns.
          </li>
          <li className="mb-2">
            <strong>Make a One-Time Payment:</strong> After selecting your
            investment tier, make a one-time payment to the campaign-fund
            wallet. This payment will not go directly to the project, company,
            or individual seeking funding, ensuring a secure transaction
            process.
          </li>
          <li className="mb-2">
            <strong>Monitor Your Investments:</strong> Visit the &quot;My
            Portfolio&quot; page to check in on your investments. Here, you can
            see the amount invested and access links to individual campaigns to
            track their progress.
          </li>
          <li className="mb-2">
            <strong>Repeat as Necessary:</strong> Feel free to repeat the
            investment process for any other campaigns you wish to support. The
            flexibility of the platform allows you to diversify your investments
            based on your interests.
          </li>
        </ol>
      </>
    ),
  },
  {
    icon: <FaBullhorn />,
    title: "How to Get Funded",
    content: (
      <>
        <ol className="list-decimal list-inside mb-4">
          <li className="mb-2">
            <strong>Connect Your Crypto Wallet:</strong> Begin by connecting
            your crypto wallet to the Seize platform to facilitate your funding
            campaign.
          </li>
          <li className="mb-2">
            <strong>Create a New Campaign:</strong> Click the &quot;Create New
            Campaign&quot; button and fill in the preferred fields on the form
            page. The more information you provide, the better your chances of
            attracting investors.
          </li>
          <li className="mb-2">
            <strong>Deposit Initial Funds:</strong> Deposit the first $15 into
            your campaign. This initial investment demonstrates commitment and
            helps establish credibility.
          </li>
          <li className="mb-2">
            <strong>Promote Your Campaign:</strong> Tell the world about your
            campaign in your own way. Use various channels to share your
            campaign, including:
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>
                Social Media: Utilize platforms like Facebook, Twitter, and
                Instagram to reach a wider audience.
              </li>
              <li>
                Personal Networks: Share your campaign with friends and family
                to generate initial support.
              </li>
              <li>
                Advertising: Consider running targeted ads through platforms
                like Google and Facebook to attract potential investors.
              </li>
              <li>
                Grassroots Campaigns: Create fliers and other promotional
                materials to engage your local community.
              </li>
            </ul>
          </li>
        </ol>
      </>
    ),
  },
  {
    icon: <FaCogs />,
    title: "Seize Charging guide",
    content: (
      <>
        <ol className="list-decimal list-inside mb-4">
          <li className="mb-2">
            <strong>Introduction to Terminology:</strong>
            Users who open a campaign are referred to as “Seizer/s,” “User/s,”
            “Creator/s,” or “Owner/s.” Those who send funds to a campaign are
            referred to as “Investor/s,” “Donator/s,” or “Purchaser/s.”
          </li>
          <li className="mb-2">
            <strong>Opening a Campaign:</strong>A fee of 15 USDC equivalent to
            the native coin of the blockchain will be charged when creating a
            campaign. This fee is allocated to a grant fund for projects meeting
            specific requirements. Final decisions about these grants involve
            community interaction but are ultimately made by the Seize team,
            which may include interviews, background checks, or other
            investigatory methods.
          </li>
          <li className="mb-2">
            <strong>Options for Ending Campaigns:</strong>
            Seizer/s can end campaigns early if 80% or more of the total raise
            amount is achieved. Alternatively, they can wait until the campaign
            expires, hoping to gather the full amount. If the 80% threshold is
            acceptable, the Seizer decides whether to close the campaign early.
          </li>
          <li className="mb-2">
            <strong>Withdrawals and Milestones:</strong>
            After a campaign ends, Creator/s can withdraw 5% of funds before
            achieving the first milestone. Additional funds are released upon
            milestone verification by a Seize team member.
          </li>
          <li className="mb-2">
            <strong>Fundraising Limits:</strong>
            Investment campaigns cannot exceed their fundraising targets, while
            donation campaigns can raise additional funds. Donation campaigns
            can be ended by Creator/s once at least 80% of the target is met.
          </li>
          <li className="mb-2">
            <strong>Refund Policy:</strong>
            If a campaign fails to meet its target or reach 80%, funds are
            refunded to investors’ wallets, with gas fees borne by the
            individual investors. The 15 USDC creation fee remains in the grant
            fund and is non-refundable.
          </li>
          <li className="mb-2">
            <strong>Campaign Cancellation and Extensions:</strong>
            Investment campaigns can be canceled by the Creator at any time,
            with gas fees deducted from investor contributions. Campaigns are
            eligible for a one-time 30-day extension if the Creator believes the
            goal is still achievable within the extended timeframe. The
            extension starts at the original campaign’s end date and expires 30
            calendar days later at the same hour.
          </li>
        </ol>
      </>
    ),
  },
  {
    icon: <FaBook />,
    title: "User recommendation guide",
    content: (
      <>
        <ol className="list-decimal list-inside mb-4">
          <li className="mb-2">
            <strong>Reasonable Campaign Raises:</strong>
            Setting an appropriate fundraising goal is crucial. The Seizer
            should carefully consider the amount to raise as it significantly
            influences investor confidence. If the target appears too high and
            unlikely to reach the 80% threshold, investors may hesitate to
            contribute, leading to potential failure before the campaign’s
            expiration. For more insights on timeframes and their impact, see
            Section 2.
          </li>
          <li className="mb-2">
            <strong>Realistic Time Frames:</strong>
            Timeframes are fully customizable by the Seizer, allowing
            flexibility in fundraising duration. However, the time period should
            be aligned with the fundraising goal, offered incentives, and target
            audience. A timeframe that is too long may signal a lack of
            confidence in the campaign, while one that is too short could limit
            fundraising opportunities. Carefully balance these factors to
            optimize your campaign’s success.
          </li>
          <li className="mb-2">
            <strong>Offer Proper Incentives:</strong>
            The structure, amount, and reliability of incentives play a key role
            in attracting investors. Asking for significant amounts without
            clear and compelling incentives can diminish confidence. Refer to
            Section 5 for advice on providing substantial information to back
            your campaign.
          </li>
          <li className="mb-2">
            <strong>Realistic Milestones:</strong>
            Seizers have the flexibility to define their own milestones, which
            are key objectives required to unlock funds incrementally.
            Initially, 5% of funds are released to begin work on the first
            milestone. Subsequent milestones unlock additional funds as defined
            by the project. Ensure milestones are realistic and clearly
            explained to facilitate approval by Seize’s review team. While Seize
            implements measures to protect investors, the decision to invest
            remains solely with the investor, and Seize is not liable for those
            choices.
          </li>
          <li className="mb-2">
            <strong>Personal/Company Information:</strong>
            Transparency is critical in gaining investor trust. Providing
            detailed and reliable information about your campaign, your personal
            or company background, and the use of funds will reassure investors.
            The more evidence and confidence you provide, the greater the
            likelihood of securing support.
          </li>
        </ol>
      </>
    ),
  },
  {
    icon: <FaGift />,
    title: "Conclusion",
    content: (
      <>
        <p className="mb-4">
          Seize is poised to become the end-all-be-all of crowdsourcing
          solutions, merging various funding mechanisms into a single platform.
          Our approach allows us to cater to a diverse array of funding needs,
          whether it&apos;s a quick loan for personal expenses or a significant
          investment in a small business.
        </p>
        <p className="mb-4">
          By leveraging the power of blockchain technology, Seize ensures
          security and anonymity for users while maintaining transparency in
          transactions. Our platform encourages a community-oriented approach to
          funding, where the sharing of resources can lead to the empowerment of
          individuals and businesses alike.
        </p>
        <p className="mb-4">
          To start a campaign, simply click the &quot;Start a Campaign&quot;
          button and provide the relevant information. While most details are
          voluntary, offering more information increases your chances of gaining
          community support. Rest assured that personal information will be kept
          confidential and only shared with our security team for verification
          purposes.
        </p>
      </>
    ),
  },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="h-full flex flex-col md:flex-row flex-1 overflow-hidden bg-background text-foreground">
      <div className="hidden md:block w-64 shrink-0 bg-default-900 border-r border-border">
        <Sidebar
          pageContent={pageContent}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <div className="md:hidden">
        <TopTabs
          pageContent={pageContent}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <div className="flex-grow p-6 md:p-10 overflow-y-auto">
        <div>
          <h1 className="text-3xl font-bold mb-6">
            {pageContent[activeTab].title}
          </h1>
          <div className="prose prose-invert max-w-none">
            {pageContent[activeTab].content}
          </div>
        </div>
      </div>
    </div>
  );
}
