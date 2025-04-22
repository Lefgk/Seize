"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import {
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  compassWallet,
  rabbyWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { ToastContainer } from "react-toastify";
import { useChainData } from "@/hooks/useChainData";

const queryClient = new QueryClient();

const RainbowProvider = ({ children }: { children: React.ReactNode }) => {
  const { chain } = useChainData();
  const config = useMemo(
    () =>
      getDefaultConfig({
        appName: "sieze",
        projectId: "39482929",
        chains: [chain],
        wallets: [
          {
            groupName: "Recommended",
            wallets: [
              compassWallet,
              metaMaskWallet,
              rabbyWallet,
              rainbowWallet,
              trustWallet,
            ],
          },
        ],
      }),
    [chain]
  );

  return (
    <WagmiProvider reconnectOnMount={true} config={config}>
      <QueryClientProvider client={queryClient}>
        <ToastContainer position="bottom-right" />
        <RainbowKitProvider initialChain={chain}>
          <>{children}</>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
export default RainbowProvider;
