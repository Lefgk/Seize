"use client";
import CampaignsGrid from "@/components/campaigns/CampaignsGrid";
import { useEffect, useState } from "react";
import { useCampaignFactory } from "@/hooks/useCampaignFactory";
import { Campaign, ContractCampaign } from "@/types/campaign";
import { fetchApiCampaign } from "@/utils/api";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { parseCampaign } from "@/utils/campaigns";
import { useChainData } from "@/hooks/useChainData";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalCampaigns, setTotalCampaigns] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const chain = useChainData();
  const { address } = useAccount();
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<number>(0);
  const campaignsPerPage = 20;
  const campaignFactoryContract = useCampaignFactory();

  const fetchCampaigns = async (page: number) => {
    try {
      if (!campaignFactoryContract) throw new Error("Contract not found");
      setLoading(true);
      let total: number;
      if (status === 0) {
        total = Number(
          await campaignFactoryContract.read.getNumCampaignsByCreator([
            address as `0x${string}`,
          ])
        );
      } else {
        total = Number(
          await campaignFactoryContract.read.getNumCampaignsInvestedByUser([
            address as `0x${string}`,
          ])
        );
      }
      setTotalCampaigns(total);
      if (total === 0) {
        setCampaigns([]);
        setLoading(false);
        return;
      }
      const startIndex = (page - 1) * campaignsPerPage;
      const endIndex = Math.min(startIndex + campaignsPerPage - 1, total - 1);
      console.log(BigInt(startIndex), BigInt(endIndex), BigInt(status));
      let contractCampaigns: ContractCampaign[];

      if (status === 0) {
        contractCampaigns =
          (await campaignFactoryContract.read.getCampaignsCreatedByUserInRange([
            address as `0x${string}`,
            BigInt(startIndex),
            BigInt(endIndex),
          ])) as ContractCampaign[];
      } else {
        contractCampaigns =
          (await campaignFactoryContract.read.getCampaignsInvestedByUserInRange(
            [address as `0x${string}`, BigInt(startIndex), BigInt(endIndex)]
          )) as ContractCampaign[];
      }
      const fetchedCampaigns: Campaign[] = await Promise.all(
        contractCampaigns.map(async (contractCampaign) => {
          const campaignDetails: ContractCampaign = contractCampaign;
          const apiCampaign = await fetchApiCampaign(campaignDetails.title);
          return parseCampaign(campaignDetails, apiCampaign, chain.chainId);
        })
      );
      setCampaigns(fetchedCampaigns);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setLoading(false);
      setCampaigns([]);
      setTotalCampaigns(0);
    }
  };

  useEffect(() => {
    fetchCampaigns(currentPage);
  }, [currentPage, chain, status]);

  const totalPages = Math.ceil(totalCampaigns / campaignsPerPage);

  return (
    <div className="w-full space-y-3 px-4 md:px-8 py-4 md:py-4">
      <div className="flex gap-3 overflow-x-auto bg-default-900">
        {[
          { value: 0, label: "My Created" },
          { value: 1, label: "My Invested" },
        ].map((item, index) => (
          <Button
            key={index}
            variant={"outline"}
            onClick={() => setStatus(item.value)}
            className={`flex normal-case bg-default-900 items-center px-4 py-2 transition-colors ${
              status === item.value
                ? "bg-primary text-primary-foreground hover:bg-primary"
                : "text-foreground hover:bg-default-800"
            }`}
          >
            <span className="text-sm whitespace-nowrap">{item.label}</span>
          </Button>
        ))}
      </div>

      <CampaignsGrid loading={loading} campaigns={campaigns} />
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pageNumber);
                      }}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                (pageNumber === currentPage - 2 && currentPage > 3) ||
                (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return <PaginationEllipsis key={i} />;
              }
              return null;
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default CampaignsPage;
