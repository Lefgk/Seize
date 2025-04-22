import { ChainData } from "@/types/chain";
import { sei, base, avalanche, pulsechain, bsc } from "viem/chains";

export const chains: ChainData[] = [
  {
    name: "Avalanche C-Chain",
    nativeToken: "AVAX",
    chain: avalanche,
    tokens: {
      "0x0000000000000000000000000000000000000000": {
        symbol: "AVAX",
        decimals: 18,
      },
      "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E": {
        symbol: "USDC",
        decimals: 6,
      },
    },
    chainId: 43114,
    contracts: {
      factory: "0x760927a63e76BbE74Dd1721d2ba39340d1278Cca",
      feeContract: "0x0745DB12c2faab740DA09f69310B5b9604A6FFff",
      feeCalculator: "0x",
      SteadFast: "0x",
      EgoVersus: "0x",
      Raffle: "0xD6540D2872292Bc1a82ba14278510Fc77b3a71Ef",
      Paradise: "0xe3769efB33243E66cf963895469da4F469A3Fc47",
    },
    image: "/chains/avax.png",
  },

  {
    name: "Base",
    nativeToken: "ETH",
    chain: base,
    tokens: {
      "0x0000000000000000000000000000000000000000": {
        symbol: "ETH",
        decimals: 18,
      },
      "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913": {
        symbol: "USDC",
        decimals: 6,
      },
    },
    contracts: {
      factory: "0x760927a63e76BbE74Dd1721d2ba39340d1278Cca",
      feeContract: "0x0745DB12c2faab740DA09f69310B5b9604A6FFff",
      feeCalculator: "0xbeFC1Bbc1094eAA2E79AF74B499E6b0077E87658",
      SteadFast: "0x1D5c8d068a8C2dBdC4bb371effb62870482aeb88",
      EgoVersus: "0x67107f0F15b24B3566d7ea0823166b11D16AaDDf",
      Paradise: "0x4D665D3c942c0Cf9a78f81BDE49C61f28531852D",
      Raffle: "0x94706183C580fEFd0917daFAA420De71A06cD4f3",
    },
    chainId: 8453,
    image: "/chains/base.png",
  },
  {
    name: "PulseChain",
    nativeToken: "PLS",
    chain: pulsechain,
    tokens: {
      "0x0000000000000000000000000000000000000000": {
        symbol: "PLS",
        decimals: 18,
      },
      "0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07": {
        symbol: "USDC",
        decimals: 6,
      },
    },
    contracts: {
      factory: "0x760927a63e76BbE74Dd1721d2ba39340d1278Cca",
      feeContract: "0x0745DB12c2faab740DA09f69310B5b9604A6FFff",
      feeCalculator: "0x",
      SteadFast: "0x",
      EgoVersus: "0x",
      Raffle: "0xe3769efB33243E66cf963895469da4F469A3Fc47",
      Paradise: "0x",
    },
    chainId: 369,
    image: "/chains/pulse.png",
  },

  {
    name: "Binance Smart Chain (BSC)",
    nativeToken: "BNB",
    chain: bsc,
    tokens: {
      "0x0000000000000000000000000000000000000000": {
        symbol: "BNB",
        decimals: 18,
      },
      "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d": {
        symbol: "USDC",
        decimals: 18,
      },
    },
    chainId: 56,
    contracts: {
      factory: "0x760927a63e76BbE74Dd1721d2ba39340d1278Cca",
      feeContract: "0x0745DB12c2faab740DA09f69310B5b9604A6FFff",
      feeCalculator: "0x",
      SteadFast: "0x",
      EgoVersus: "0x",
      Raffle: "0x73CA3531E0080c45E2B58FED5a6D126Ef7b7112C",
      Paradise: "0x",
    },
    image: "/chains/bsc.png",
  },
  {
    name: "Sei",
    nativeToken: "SEI",
    chain: sei,
    tokens: {
      "0x0000000000000000000000000000000000000000": {
        symbol: "SEI",
        decimals: 18,
      },
      "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1": {
        symbol: "USDC",
        decimals: 6,
      },
    },
    contracts: {
      factory: "0x760927a63e76BbE74Dd1721d2ba39340d1278Cca",
      feeContract: "0xD6540D2872292Bc1a82ba14278510Fc77b3a71Ef",
      feeCalculator: "0x8d599a2B307988B7D3DA95E1629BAAA6fF6278ef",
      SteadFast: "0x2a841DA3C7df286161A554733555b0eA1964B767",
      EgoVersus: "0xdd6063ded9E03274c2F80714683e91FA719D039a",
      Paradise: "0x577917B5d25cB4ed6a485c61E0DB858fDD032b96",
      Raffle: "0x73CA3531E0080c45E2B58FED5a6D126Ef7b7112C",
    },
    chainId: 1329,
    image: "/chains/sei.png",
  },
  // {
  //   name: "BSC Testnet",
  //   nativeToken: "BNB",
  //   chain: bscTestnet,
  //   tokens: {
  //     "0x0000000000000000000000000000000000000000": {
  //       symbol: "BNB",
  //       decimals: 18,
  //     },
  //     "0x64544969ed7EBf5f083679233325356EbE738930": {
  //       symbol: "USDC",
  //       decimals: 6,
  //     },
  //   },

  //   contracts: {
  //     factory: "0x33540de7Bb5A6744F795898a02289E747Ad202C1",
  //   },
  //   chainId: 97,
  //   image: "/chains/bsc.png",
  // },
  // {
  //   name: "Ethereum (ETH)",
  //   nativeToken: "ETH",
  //   chain: mainnet,
  //   tokens: {
  //     "0x0000000000000000000000000000000000000000": {
  //       symbol: "ETH",
  //       decimals: 18,
  //     },
  //     "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": {
  //       symbol: "USDC",
  //       decimals: 6,
  //     },
  //   },
  //   contracts: {
  //     factory: "0x463a8685b7521d80e4ce83fcfd4da242fe42a319",
  //   },
  //   chainId: 1,
  //   image: "/chains/eth.png",
  // },
  // {
  //   name: "Polygon (Matic)",
  //   nativeToken: "MATIC",
  //   chain: mainnet,
  //   tokens: {
  //     "0x0000000000000000000000000000000000000000": {
  //       symbol: "MATIC",
  //       decimals: 18,
  //     },
  //     "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174": {
  //       symbol: "USDC",
  //       decimals: 6,
  //     },
  //   },
  //   contracts: {
  //     factory: "0x463a8685b7521d80e4ce83fcfd4da242fe42a319",
  //   },
  //   chainId: 137,
  //   image: "/chains/matic.png",
  // },
  // {
  //   name: "Arbitrum",
  //   nativeToken: "ETH",
  //   chain: arbitrum,
  //   tokens: {
  //     "0x0000000000000000000000000000000000000000": {
  //       symbol: "ETH",
  //       decimals: 18,
  //     },
  //     "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": {
  //       symbol: "USDC",
  //       decimals: 6,
  //     },
  //   },
  //   contracts: {
  //     factory: "0x463a8685b7521d80e4ce83fcfd4da242fe42a319",
  //   },
  //   chainId: 42161,
  //   image: "/chains/arbitrum.png",
  // },
  // {
  //   name: "Optimism",
  //   nativeToken: "ETH",
  //   chain: optimism,
  //   tokens: {
  //     "0x0000000000000000000000000000000000000000": {
  //       symbol: "ETH",
  //       decimals: 18,
  //     },
  //     "0x7F5c764cBc14f9669B88837ca1490cCa17c31607": {
  //       symbol: "USDC",
  //       decimals: 6,
  //     },
  //   },
  //   contracts: {
  //     factory: "0x463a8685b7521d80e4ce83fcfd4da242fe42a319",
  //   },
  //   chainId: 10,
  //   image: "/chains/optimism.png",
  // },
  // {
  //     id: "base",
  //     name: "Base",
  //     nativeToken: "ETH",
  //     chain: base,
  //     tokens: {
  //         "0x0000000000000000000000000000000000000000": {
  //             symbol: "ETH",
  //             decimals: 18
  //         },
  //         "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913": {
  //             symbol: "USDC",
  //             decimals: 6
  //         }
  //     },
  //     chainId: 8453,
  //     image: "/chains/base.png"
  // },
  // {
  //     name: "Sonic",
  //     nativeToken: "SONIC",
  //     chain: sonic,
  //     tokens: {
  //         "0x0000000000000000000000000000000000000000": {
  //             symbol: "SONIC",
  //             decimals: 18
  //         },
  //         "0x29219dd400f2Bf60E5a23d13Be72B486D4038894": {
  //             symbol: "USDC",
  //             decimals: 6
  //         }
  //     },
  //     contracts: {
  //         factory: "0x463a8685b7521d80e4ce83fcfd4da242fe42a319"
  //     },
  //     chainId: 146,
  //     image: "/chains/sonic.png"
  // },
];
