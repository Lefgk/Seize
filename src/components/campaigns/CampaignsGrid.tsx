import { Campaign } from "@/types/campaign";
import React, { useState, useMemo, useEffect } from "react";
import { CampaignCard } from "./CampaignCard";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from 'lucide-react';
import { BsGrid, BsTable } from 'react-icons/bs';
import { CampaignsTable } from "./CampaignsTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CiFilter } from "react-icons/ci";
import { IconButton } from "../ui/icon-button";

const CampaignsGrid = ({ loading, campaigns, gridContent }: { loading: boolean; campaigns: Campaign[], gridContent?: React.ReactNode }) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [campaignsToShow, setCampaignsToShow] = useState<Campaign[]>([]);
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [campaignType, setCampaignType] = useState("all")
    const [campaignCategory, setCampaignCategory] = useState("All")
    const [sortOption, setSortOption] = useState("newest")
    const handleNavigate = (campaign: Campaign) => {
        router.push(`/campaigns/${campaign.campaignAddress}`);
    };

    const filteredCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => {
            const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType =
                campaignType === "all" ||
                (campaignType === "donate" && campaign.campaignType === "Donate") ||
                (campaignType === "investment" && campaign.campaignType === "Invest");
            const matchesCategory =
                campaignCategory === "All" ||
                campaign.category === campaignCategory
            return matchesSearch && matchesType && matchesCategory;
        });
    }, [campaigns, searchTerm, campaignType, campaignCategory]);

    useEffect(() => {
        const sorted = [...filteredCampaigns];
        switch (sortOption) {
            case "oldest":
                sorted.sort((a, b) => a.creationTime - b.creationTime);
                break;
            case "newest":
                sorted.sort((a, b) => b.creationTime - a.creationTime);
                break;
            case "mostFunded":
                sorted.sort((a, b) => b.totalContributions - a.totalContributions);
                break;
            case "leastFunded":
                sorted.sort((a, b) => a.totalContributions - b.totalContributions);
                break;
            case "mostBacked":
                sorted.sort((a, b) => b.contributors - a.contributors);
                break;
            case "leastBacked":
                sorted.sort((a, b) => a.contributors - b.contributors);
                break;
        }
        setCampaignsToShow(sorted);
    }, [filteredCampaigns, sortOption]);

    return (
        <div className="flex flex-col w-full gap-y-4 mt-0">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <div className="relative flex-grow w-full sm:w-auto">
                    <Input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                </div>

                <div className="flex items-center gap-2">
                    <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger className="w-[180px] bg-default-800">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-default-800">
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            <SelectItem value="mostFunded">Most Funded</SelectItem>
                            <SelectItem value="leastFunded">Least Funded</SelectItem>
                            <SelectItem value="mostBacked">Most Backed</SelectItem>
                            <SelectItem value="leastBacked">Least Backed</SelectItem>
                        </SelectContent>
                    </Select>

                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <IconButton variant="outline" className="group-data-[state=open]:bg-default-800">
                                <CiFilter className="h-4 w-4" />
                            </IconButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Campaign Type</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {[
                                { value: "all", label: "All" },
                                { value: "donate", label: "Donations" },
                                { value: "investment", label: "Investments" },
                            ].map((type) => (
                                <DropdownMenuCheckboxItem
                                    key={type.value}
                                    checked={campaignType === type.value}
                                    onCheckedChange={() => setCampaignType(type.value)}
                                >
                                    {type.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Campaign Category</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {[
                                { value: "all", label: "All" },
                                { value: "crypto-related", label: "Crypto related" },
                                { value: "personal-loan", label: "Personal Loan" },
                                { value: "business-loan", label: "Business Loan" },
                                { value: "start-up", label: "Start up funds" },
                                { value: "real-estate", label: "Real Estate" },
                                { value: "foundation", label: "Foundation" },
                                { value: "group", label: "Group" },
                                { value: "individual", label: "Individual" },
                                { value: 'other', label: 'Other' },
                            ].map((category) => (
                                <DropdownMenuCheckboxItem
                                    key={category.value}
                                    checked={campaignCategory === category.label}
                                    onCheckedChange={() => setCampaignCategory(category.label)}
                                >
                                    {category.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex gap-2 items-center">
                        <IconButton
                            variant={viewMode === "grid" ? "default" : "outline"}
                            onClick={() => setViewMode("grid")}
                        >
                            <BsGrid className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                            variant={viewMode === "table" ? "default" : "outline"}
                            onClick={() => setViewMode("table")}
                        >
                            <BsTable className="h-4 w-4" />
                        </IconButton>
                    </div>
                </div>
            </div>

            {loading ? (
                viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-card border rounded-md flex flex-col gap-2">
                                <div className="overflow-hidden transition-all hover:shadow-lg">
                                    <div className="relative pb-[100%] w-full animate-pulse bg-muted"></div>
                                    <div className="p-4 flex flex-col gap-2">
                                        <div className="bg-muted animate-pulse w-full h-4"></div>
                                        <p className="w-full h-2 mt-2 animate-pulse bg-muted"></p>
                                        <p className="w-full h-2 animate-pulse bg-muted"></p>
                                        <p className="w-full h-2 animate-pulse bg-muted"></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="animate-pulse">
                        <div className="h-6 bg-muted mb-2"></div>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-10 bg-muted mb-2"></div>
                        ))}
                    </div>
                )
            ) : (campaignsToShow.length === 0 && !gridContent) ? (
                <p className="text-lg uppercase text-center text-foreground/80 py-10 font-semibold">No campaigns found</p>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {!!gridContent ? gridContent : null}
                    {campaignsToShow.map((campaign, i) => (
                        <CampaignCard
                            key={i}
                            campaign={campaign}
                            handleClick={() => handleNavigate(campaign)}
                        />
                    ))}
                </div>
            ) : (
                <CampaignsTable campaigns={campaignsToShow} />
            )}
        </div>
    );
};

export default CampaignsGrid;

