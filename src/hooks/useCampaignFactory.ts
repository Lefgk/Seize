import abi from "@/config/abi";
import { useChainData } from "@/hooks/useChainData";
import { getContract } from "viem";
import { useClient, usePublicClient } from "wagmi";

export const useCampaignFactory = () => {
  const client = useClient();
  const { chainId, contracts } = useChainData();
  const publicClient = usePublicClient({ chainId });

  if (!publicClient) return null;

  const contract = getContract({
    address: contracts.factory as `0x${string}`,
    abi: abi.Factory,
    client: { public: publicClient, wallet: client },
  });
  return contract;
};

export const useFeeCalcFactory = () => {
  const client = useClient();
  const { chainId, contracts } = useChainData();
  const publicClient = usePublicClient({ chainId });

  if (!publicClient) return null;

  const contract = getContract({
    address:
      contracts.feeCalculator || "0xB31F8EeA5cD51B5682d59B07cCecEBc36cf720Ad",
    abi: abi.FeesCalc,
    client: { public: publicClient, wallet: client },
  });
  return contract;
};

export const useSteadFastContract = () => {
  const client = useClient();
  const { chainId, contracts } = useChainData();
  const publicClient = usePublicClient({ chainId });

  if (!publicClient) return null;

  const contract = getContract({
    address: contracts.SteadFast as `0x${string}`,
    abi: abi.SteadFast,
    client: { public: publicClient, wallet: client },
  });
  return contract;
};

export const useRaffleContract = () => {
  const client = useClient();
  const { chainId, contracts } = useChainData();
  const publicClient = usePublicClient({ chainId });

  if (!publicClient) return null;

  const contract = getContract({
    address: contracts.Raffle as `0x${string}`,
    abi: abi.Raffle,
    client: { public: publicClient, wallet: client },
  });
  return contract;
};

export const useParadiseContract = () => {
  const client = useClient();
  const { chainId, contracts } = useChainData();
  const publicClient = usePublicClient({ chainId });

  if (!publicClient) return null;

  const contract = getContract({
    address: contracts.Paradise as `0x${string}`,
    abi: abi.Paradise,
    client: { public: publicClient, wallet: client },
  });
  return contract;
};

export const useEgoVersusContract = () => {
  const client = useClient();
  const { chainId, contracts } = useChainData();
  const publicClient = usePublicClient({ chainId });
  console.log(chainId);
  if (!publicClient) return null;

  const contract = getContract({
    address: contracts.EgoVersus as `0x${string}`,
    abi: abi.EgoVersus,
    client: { public: publicClient, wallet: client },
  });
  return contract;
};

export const useFeeContract = () => {
  const client = useClient();
  const { chainId, contracts } = useChainData();
  const publicClient = usePublicClient({ chainId });

  if (!publicClient) return null;

  const contract = getContract({
    address: contracts.feeContract as `0x${string}`,
    abi: abi.FeeSplitter,
    client: { public: publicClient, wallet: client },
  });
  return contract;
};
