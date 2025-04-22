import { Campaign } from "@/types/campaign";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, User } from "lucide-react";
import { getRemainingTime, shortenText } from "@/utils/helpers";
import Image from "../ui/image";
import { useTime } from "@/hooks/useTime";
import { useMemo } from "react";
import { useChainData } from "@/hooks/useChainData";

interface CampaignCardProps {
  campaign: Campaign;
  handleClick: (id: string) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  handleClick,
}) => {
  const chain = useChainData();
  const {
    // id,
    maxDeposits,
    title,
    story,
    imageUrl,
    goalAmount,
    totalContributions,
    creator,
  } = campaign;
  const time = useTime();
  const percentageRaised =
    (totalContributions / goalAmount / (maxDeposits > 0 ? maxDeposits : 1)) *
    100;

  const token = useMemo(() => chain.tokens[campaign.token], [chain]);
  return (
    <Card
      className="overflow-hidden cursor-pointer hover:bg-default-700 group transition-all hover:shadow-lg"
      onClick={() => handleClick(campaign.campaignAddress)}
    >
      <CardHeader className="p-0">
        <div className="relative pb-[100%] w-full">
          <div className=" absolute left-0 top-0 w-full h-full">
            <Image
              src={imageUrl}
              alt={title}
              className="flex justify-center items-center w-full h-full"
              imgClassName="object-cover object-center w-full h-full"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="mb-2 text-xs font-medium uppercase leading-[normal] text-muted-foreground text-ellipsis whitespace-nowrap overflow-hidden">
          {campaign.campaignType} - {campaign.category}
        </p>
        <CardTitle className="mb-1 text-ellipsis whitespace-nowrap overflow-hidden">
          {title}
        </CardTitle>
        <p className="mb-2 text-sm leading-[normal] text-muted-foreground text-ellipsis whitespace-nowrap overflow-hidden">
          {story || <span className="text-transparent">.</span>}
        </p>
        <div className="mb-4">
          <Progress value={percentageRaised} className="h-2" />
          <div className="mt-2 text-sm text-ellipsis whitespace-nowrap overflow-hidden w-full">
            <span className="text-foreground">Raised</span>{" "}
            <span className="font-medium text-primary">
              {(
                Number(totalContributions) / Math.pow(10, token?.decimals || 18)
              ).toLocaleString()}{" "}
              {token?.symbol}
            </span>{" "}
            <span className="text-foreground">
              ({+Number(percentageRaised.toFixed(1))}%) of{" "}
              {(
                Number(
                  campaign.maxDeposits === 0
                    ? campaign.goalAmount
                    : campaign.maxDeposits * campaign.goalAmount
                ) / Math.pow(10, token?.decimals || 18)
              ).toLocaleString()}{" "}
              {token?.symbol}
            </span>
          </div>
        </div>{" "}
        {/* {campaign.isActive ? "y" : "n"} */}
        <div className="flex flex-col justify-between text-sm text-muted-foreground">
          {
            // time < campaign.endTime * 1000 ||
            campaign.isActive && (
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />

                <span>
                  {!campaign.isActive
                    ? "ENDED"
                    : `${getRemainingTime(
                        campaign.endTime * 1000 - time
                      )} left`}
                </span>
              </div>
            )
          }
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>By {shortenText(creator)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          //   onClick={() => onViewCampaign(id)}
          className="w-full"
          variant={"ripple"}
        >
          View Campaign
          <ArrowRight className="group-hover:translate-x-1 transition-all ease-in duration-150" />
        </Button>
      </CardFooter>
    </Card>
  );
};
