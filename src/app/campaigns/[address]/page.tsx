"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CampaignDetails from "@/components/campaigns/CampaignDetails";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Campaign,
    CampaignContributor,
    ContractCampaign,
} from "@/types/campaign";
import abi from "@/config/abi";
import { useAccount, useClient, usePublicClient } from "wagmi";
import { fetchApiCampaign } from "@/utils/api";
import { parseCampaign } from "@/utils/campaigns";
import { useChainData } from "@/hooks/useChainData";
import { useCampaignFactory } from "@/hooks/useCampaignFactory";
import { getContract } from "viem";

export default function CampaignPage() {
    const { address: addressParam } = useParams();
    const { address } = useAccount();
    const chain = useChainData()
    const router = useRouter()
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [userContribution, setUserContribution] = useState(0);
    const [contributors, setContributors] = useState<
        CampaignContributor[] | null
    >(null);
    const client = useClient()
    const publicClient = usePublicClient({ chainId: chain.chainId })
    const campaignFactoryContract = useCampaignFactory()
    const campaignAddress = useMemo(
        () => decodeURIComponent((Array.isArray(addressParam) ? addressParam[0] : addressParam) || ""),
        [addressParam]
    );

    const getCampaign = async () => {
        try {
            if (!campaignAddress || !publicClient || !campaignFactoryContract) {
                setCampaign(null)
                return null;
            }
            const campaignContract = getContract({
                abi: abi.Campaign,
                address: campaignAddress as `0x${string}`,
                client: { public: publicClient, wallet: client }
            })
            const campaignDetails: ContractCampaign = (await campaignContract.read.getCampaignDetails()) as ContractCampaign;

            const apiCampaign = await fetchApiCampaign(campaignDetails.title);
            console.log(apiCampaign)
            const fetchedCampaign: Campaign = parseCampaign(campaignDetails, apiCampaign, chain.chainId)
            setCampaign(fetchedCampaign);
            const events = await publicClient.getContractEvents({
                address: fetchedCampaign.campaignAddress as `0x${string}`,
                abi: abi.Campaign,
                eventName: "ContributionReceived",
                fromBlock: "earliest",
                toBlock: "latest",
            });
            const contributions: CampaignContributor[] = events.map((x: any) => x.args);
            const userContribution =
                contributions.find(
                    (x) => x?.contributor.toLowerCase() === address?.toLowerCase()
                )?.amount || 0;

            setUserContribution(userContribution);
            setContributors(contributions);
        } catch (e) {
            console.error(e)
        }
    };

    useEffect(() => {
        if (campaignAddress) getCampaign();
    }, [campaignAddress, address, chain]);
    useEffect(() => {
        if (campaign && campaign.chainId !== chain.chainId) router.push('/')
    }, [chain.chainId])
    if (!campaign) return <CampaignSkeleton />;
    return (
        <CampaignDetails
            setCampaign={setCampaign}
            getCampaign={() => setTimeout(() => getCampaign(), 1000)}
            campaign={campaign}
            contributors={contributors}
            userContribution={userContribution}
        />
    );
}

function CampaignSkeleton() {
    return (
        <div className="space-y-10">
            <Skeleton className="h-[300px] w-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-[200px] w-full" />
        </div>
    );
}
