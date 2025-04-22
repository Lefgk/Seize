import { ApiCampaign, Campaign, ContractCampaign } from "@/types/campaign"
import { apiUploadUrl } from "./api"

export const parseCampaign = (campaignDetails: ContractCampaign, apiCampaign: ApiCampaign | null, chainId: number): Campaign => {
    return {
        creator: campaignDetails.creator,
        goalAmount: Number(campaignDetails.goalAmount),
        creationTime: Number(campaignDetails.creationTime),
        endTime: Number(campaignDetails.endTime),
        title: campaignDetails.title,
        category: campaignDetails.category,
        perks: apiCampaign?.perks || "",
        website: campaignDetails.website,
        youtube: "",
        story: apiCampaign?.story || "",
        pdfUrl: apiCampaign?.pdfUrl ? apiUploadUrl(apiCampaign.pdfUrl) : "",
        imageUrl: apiUploadUrl(apiCampaign?.imageUrl || ""),
        token: campaignDetails.token,
        maxDeposits: Number(campaignDetails.maxDeposits),
        contributors: Number(campaignDetails.contributors),
        totalContributions: Number(campaignDetails.Totalcontributions),
        isActive: campaignDetails.isActive,
        campaignType: apiCampaign?.campaignType || "",
        extensionRequested: campaignDetails.extensionRequested,
        extensionApproved: campaignDetails.extensionApproved,
        campaignAddress: campaignDetails.campaignAddress,
        // isLLC: campaignDetails.isLLC,
        socialLinks: {
            twitter: apiCampaign?.socialLinks?.twitter || "",
            discord: apiCampaign?.socialLinks?.discord || "",
            telegram: apiCampaign?.socialLinks?.telegram || "",
            email: apiCampaign?.socialLinks?.email || "",
            youtube: apiCampaign?.socialLinks?.youtube || "",
        },
        chainId
    }
}