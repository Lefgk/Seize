"use client";
// import { useEffect, useState } from "react";
// import { useWalletClient } from "wagmi";
// import RainbowProvider from "@/contexts/RainbowProvider";
// import dynamic from "next/dynamic";
// import { ethers } from "ethers";
// import { SwapWidget } from '@uniswap/widgets'
// import '@uniswap/widgets/fonts.css'

// const SwapWidget = dynamic(
//   () => import("@uniswap/widgets").then((mod) => mod.SwapWidget),
//   { ssr: false }
// );

export default function BridgePage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <main className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Bridge your funds
          </h1>
          <p className="text-xl text-foreground">Supporting our bridge</p>
        </header>

        <section className="rounded-2xl shadow-xl">
          {/* <SwapWidget tokenList={'https://ipfs.io/ipns/tokens.uniswap.org'} /> */}
        </section>
      </main>
    </div>
  );
}

// function Card({
//   title,
//   description,
//   icon,
// }: {
//   title: string;
//   description: string;
//   icon: React.ReactNode;
// }) {
//   return (
//     <div className="bg-default-800/80 rounded-xl p-6 flex flex-col items-center text-center">
//       <div className="p-3 bg-primary/40 rounded-full">{icon}</div>
//       <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
//         {title}
//       </h3>
//       <p className="text-foreground">{description}</p>
//     </div>
//   );
// }

// function Timeline() {
//   return (
//     <div className="space-y-4">
//       <TimelineItem
//         title="Quarterly Grants"
//         description="Every three months, we distribute the accumulated funds to selected projects, offering multiple grants to help creators bring their ideas to life."
//       />
//       <TimelineItem
//         title="Grant Amounts"
//         description="Depending on the size of the fund, we offer several smaller grants or one larger grant per cycle."
//       />
//     </div>
//   );
// }
// type CustomizationProps = {
//   width: number;
//   responsiveWidth: boolean;
//   borderRadius: number;
//   accent: string;
//   onAccent: string;
//   primary: string;
//   secondary: string;
//   text: string;
//   secondaryText: string;
//   interactive: string;
//   onInteractive: string;
//   outline: string;
//   fontFamily: string;
// };
// const customize: CustomizationProps = {
//   width: 380,
//   responsiveWidth: false,
//   borderRadius: 0.8,
//   accent: "rgb(131,249,151)",
//   onAccent: "rgb(0,0,0)",
//   primary: "rgb(9,4,31)",
//   secondary: "rgb(26,27,52)",
//   text: "rgb(255,255,255)",
//   secondaryText: "rgb(200,200,200)",
//   interactive: "rgb(15, 20, 66)",
//   onInteractive: "rgb(240,240,240)",
//   outline: "rgb(18,26,91)",
//   fontFamily: "Courier New",
// };
// function TimelineItem({
//   title,
//   description,
// }: {
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="flex">
//       <div>
//         <h3 className="text-lg font-semibold mb-1">{title}</h3>
//         <p>{description}</p>
//       </div>
//     </div>
//   );
// }
