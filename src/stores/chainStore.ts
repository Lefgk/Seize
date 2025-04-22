import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChainStore {
    chainId: number,
    setChainId: (chain: number) => void
}

export const useChainIdStore = create<ChainStore>()(
    persist(
        (set) => ({
            chainId: (typeof window !== 'undefined' ? localStorage?.chain : 'base_fork') || 'base_fork',
            setChainId: (chain: number) => {
                set({ chainId: chain });
                if (typeof window !== 'undefined') {
                    localStorage.chain = chain;
                }
            }
        }),
        {
            name: 'chain',
        }
    )
);
