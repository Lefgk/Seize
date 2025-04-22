import { chains } from "@/config/chains";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import Image from "../ui/image";
import { useChainIdStore } from "@/stores/chainStore";
import { useChainData } from "@/hooks/useChainData";
import { useSwitchChain } from "wagmi";

export function ChainSelector() {
    const { chainId, setChainId } = useChainIdStore()
    const chain = useChainData()
    const { switchChain } = useSwitchChain()
    const handleChange = (value: string) => {
        setChainId(Number(value));
    };
    useEffect(() => {
        switchChain({ chainId })

    }, [chainId])
    return (
        <Select value={chainId.toString()} onValueChange={handleChange}>
            <SelectTrigger className="flex bg-default-800 items-center w-fit px-3 border rounded">
                <div className="flex items-center gap-2 mr-3">
                    <Image
                        src={chain.image}
                        alt={chain.name}
                        className="w-6 h-6 rounded-full overflow-hidden"
                        imgClassName="w-full h-full object-cover"
                    />
                </div>
            </SelectTrigger>
            <SelectContent className="bg-default-800">
                {chains.map((chain) => (
                    <SelectItem className="cursor-pointer" key={chain.chainId} value={chain.chainId.toString()}>
                        <div className="flex items-center gap-2">
                            <Image
                                src={chain.image}
                                alt={chain.name}
                                className="w-6 h-6 rounded-full overflow-hidden"
                                imgClassName="w-full h-full object-cover"
                            />
                            <span>{chain.name}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
