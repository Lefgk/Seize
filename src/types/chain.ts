import { Chain } from "viem";

export interface ChainData {
  name: string;
  nativeToken: string;
  chain: Chain;
  tokens: Record<string, { symbol: string; decimals: number }>;
  chainId: number;
  contracts: {
    feeCalculator: `0x${string}`;
    feeContract: `0x${string}`;

    SteadFast: `0x${string}`;
    EgoVersus: `0x${string}`;
    Raffle?: `0x${string}`;
    Paradise: `0x${string}`;
    factory: `0x${string}`;
  };
  image: string;
}
