import { Campaign } from "@/types/campaign";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getRemainingTime, shortenText } from "@/utils/helpers";
import { useTime } from "@/hooks/useTime";
import { useChainData } from "@/hooks/useChainData";

interface CampaignsTableProps {
  campaigns: Campaign[];
}

export const CampaignsTable: React.FC<CampaignsTableProps> = ({
  campaigns,
}) => {
  const router = useRouter();
  const time = useTime();
  const chain = useChainData();

  const handleNavigate = (campaign: Campaign) => {
    router.push(`/campaigns/${campaign.campaignAddress}`);
  };

  return (
    <div className="w-full whitespace-nowrap overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Goal</TableHead>
            <TableHead>Raised</TableHead>
            <TableHead>Time Left</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.campaignAddress}>
              <TableCell>{campaign.title}</TableCell>
              <TableCell>{shortenText(campaign.creator)}</TableCell>
              <TableCell>{campaign.campaignType}</TableCell>
              <TableCell>
                {Number(campaign.maxDeposits) === 0
                  ? (
                      Number(campaign.goalAmount) /
                      Math.pow(10, chain.tokens[campaign.token]?.decimals || 18)
                    ).toLocaleString()
                  : Number(campaign.maxDeposits).toLocaleString()}{" "}
                {chain.tokens[campaign.token]?.symbol}
              </TableCell>
              <TableCell>
                {(
                  Number(campaign.totalContributions) /
                  Math.pow(10, chain.tokens[campaign.token]?.decimals || 18)
                ).toLocaleString()}{" "}
                {chain.tokens[campaign.token]?.symbol}
              </TableCell>
              <TableCell>
                {campaign.isActive
                  ? time < campaign.endTime * 1000
                    ? getRemainingTime(campaign.endTime * 1000 - time)
                    : 0
                  : "Ended"}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleNavigate(campaign)}
                  variant="outline"
                  size="sm"
                >
                  View <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
