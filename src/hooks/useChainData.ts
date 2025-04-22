import { chains } from "@/config/chains"
import { useChainIdStore } from "@/stores/chainStore"

export const useChainData = () => {
    const { chainId } = useChainIdStore()
    return chains.find(x => x.chainId === Number(chainId)) || chains[0]
}