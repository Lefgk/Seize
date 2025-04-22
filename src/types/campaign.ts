export interface Campaign {
    chainId: number;
    campaignType: string;
    creator: string;
    goalAmount: number;
    creationTime: number;
    endTime: number;
    title: string;
    category: string;
    // isLLC: boolean;
    perks: string;
    website: string;
    youtube: string;
    story: string;
    pdfUrl?: string
    imageUrl: string;
    token: string;
    maxDeposits: number;
    contributors: number;
    totalContributions: number;
    isActive: boolean;
    extensionRequested: boolean;
    extensionApproved: boolean;
    campaignAddress: string;
    userContribution?: number;
    socialLinks: {
        twitter: string;
        discord: string;
        telegram: string;
        email: string;
        youtube?: string
    }
}

export interface ContractCampaign {
    campaignAddress: string;
    creator: string;
    goalAmount: bigint;
    creationTime: number;
    endTime: number;
    title: string;
    category: string;
    website: string;
    token: string;
    maxDeposits: bigint;
    isActive: boolean;
    contributors: bigint;
    extensionRequested: boolean;
    extensionApproved: boolean;
    Totalcontributions: bigint
}

export interface ApiCampaign {
    socialLinks: {
        twitter: string;
        discord: string;
        telegram: string;
        email: string;
        youtube?: string
    };
    _id: string;
    title: string;
    story: string;
    imageUrl: string;
    campaignType: string;
    perks: string;
    pdfUrl?: string
    createdAt: string;
}

export interface CampaignContributor {
    amount: number
    contributor: string
}