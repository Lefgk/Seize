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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "@/components/ui/image";
import { ArrowRight } from "lucide-react";
import { chains } from "@/config/chains";

const projects = [
  {
    image: "/services/egoverse.png",
    label: "EgoVersus: The First Strike",
    link: "https://seize.fund/Egoversus",
    hasContract: true,
    chains: [8453, 1329],
  },
  {
    image: "/services/steadfast.png",
    label: "Inspire",
    link: "https://seize.fund/Steadfast",
    hasContract: true,
    chains: [8453, 1329],
  },
  {
    image: "/services/paradise.png",
    label: "PARADIS3 LAND TRUST",
    link: "https://seize.fund/Paradise",
    hasContract: true,
    chains: [8453, 1329, 43114],
  },
];
const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalCampaigns, setTotalCampaigns] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const chain = useChainData();
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<number>(1);
  const campaignsPerPage = 20;
  const campaignFactoryContract = useCampaignFactory();

  const fetchCampaigns = async (page: number) => {
    try {
      if (!campaignFactoryContract) throw new Error("Contract not found");
      setLoading(true);
      let total = Number(await campaignFactoryContract.read.totalCampaigns());
      setTotalCampaigns(total);
      if (total === 0) {
        setCampaigns([]);
        setLoading(false);
        return;
      }
      if ([1, 2].includes(status)) {
        const ended = Number(await campaignFactoryContract.read.ended());
        if (status === 1) total = total - ended;
        else total = ended;
      }
      const startIndex = (page - 1) * campaignsPerPage;
      const endIndex = Math.min(startIndex + campaignsPerPage - 1, total - 1);
      console.log(BigInt(startIndex), BigInt(endIndex), BigInt(status));
      const contractCampaigns =
        (await campaignFactoryContract.read.getCampaignsInRange([
          BigInt(startIndex),
          BigInt(endIndex),
          BigInt(status),
        ])) as ContractCampaign[];
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
          { value: 0, label: "All" },
          { value: 1, label: "Active" },
          { value: 2, label: "Finished" },
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

      <CampaignsGrid
        loading={loading}
        campaigns={campaigns}
        gridContent={
          status !== 2 ? (
            <>
              {projects.map((x, i) => (
                <Link href={x.link} key={i}>
                  <Card className="overflow-hidden cursor-pointer hover:bg-default-700 group transition-all hover:shadow-lg">
                    <CardHeader className="p-0">
                      <div className="relative pb-[100%] w-full">
                        <div className=" absolute left-0 top-0 w-full h-full">
                          <Image
                            src={x.image}
                            alt={x.label}
                            className="flex justify-center items-center w-full h-full"
                            imgClassName="object-cover object-center w-full h-full"
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="mb-2 text-xs font-medium uppercase leading-[normal] text-muted-foreground text-ellipsis whitespace-nowrap overflow-hidden">
                        Project
                      </p>
                      <CardTitle className="mb-1 text-ellipsis whitespace-nowrap overflow-hidden">
                        {x.label}
                      </CardTitle>
                      <div className="flex gap-1 items-center flex-wrap mt-2">
                        {x.chains.map((x, i) => {
                          const chain = chains.find((y) => y.chainId === x);
                          if (!chain) return null;
                          else
                            return (
                              <div key={i}>
                                <Image
                                  src={chain.image}
                                  alt={x.toString()}
                                  className="w-5 h-5 rounded-full overflow-hidden"
                                />
                              </div>
                            );
                        })}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full" variant={"ripple"}>
                        View Project
                        <ArrowRight className="group-hover:translate-x-1 transition-all ease-in duration-150" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </>
          ) : null
        }
      />
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
