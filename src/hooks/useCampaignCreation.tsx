import { useState } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import * as z from "zod";
import abi from "@/config/abi";
import { useCampaignFactory } from "./useCampaignFactory";
import { API_URL } from "@/config";
import { dataURLToFile, parseTokenAmount } from "@/utils/helpers";
import { useChainData } from "./useChainData";

const urlValidation = z
  .string()
  .refine(
    (val) =>
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
        val
      ),
    "Invalid URL"
  )
  .optional();

export const campaignFormSchema = z.object({
  campaignType: z.enum(["Donate", "Invest"]),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  category: z.string().min(1, "Please select a category"),
  goalAmount: z.number().positive("Goal amount must be positive").optional(),
  minInvestment: z
    .number()
    .positive("Minimum investment must be positive")
    .optional(),
  maxDeposits: z
    .number()
    .positive("Maximum deposits must be positive")
    .optional(),
  story: z.string().min(50, "Story must be at least 50 characters long"),
  token: z.string(),
  endTime: z.date().min(new Date(), "End date must be in the future"),
  imageFile: z.string().url().optional(),
  pdfFile: z.instanceof(File).optional(),
  imageUrl: urlValidation,
  perks: z.string().optional(),
  youtubeUrl: urlValidation,
  email: z.string().email("Invalid email").optional(),
  discord: z.string().optional(),
  telegram: z.string().optional(),
  youtube: urlValidation,
  twitter: z.string().optional(),
  website: urlValidation,
  acceptedTerms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

export type CampaignFormData = z.infer<typeof campaignFormSchema>;

export function useCampaignCreation() {
  const [isLoading, setIsLoading] = useState(false);
  const chain = useChainData();
  const publicClient = usePublicClient({ chainId: chain.chainId });
  const { data: walletClient } = useWalletClient();
  const campaignFactoryContract = useCampaignFactory();

  const createCampaign = async (formData: CampaignFormData, form: any) => {
    if (!publicClient || !walletClient) throw new Error("Wallet not connected");
    if (!campaignFactoryContract) throw new Error("Contract not found");

    setIsLoading(true);
    const tokenAddress = formData.token;
    const token = chain.tokens[tokenAddress];
    if (!token)
      form.setError("token", { message: "Please select a valid token" });
    if (formData.campaignType === "Donate" && !formData.goalAmount)
      throw new Error("Funding Goal Amount is requireds");
    if (formData.campaignType === "Invest") {
      if (!formData.minInvestment)
        throw new Error("Minimum Investment is required");
      if (!formData.maxDeposits) throw new Error("Maximum Entries is required");
    }

    try {
      const params = {
        category: formData.category,
        endTime: BigInt(
          Math.floor(formData.endTime.getTime() / 1000) -
          Math.floor(Date.now() / 1000)
        ),
        goalAmount:
          formData.campaignType === "Donate"
            ? BigInt(
              parseTokenAmount(
                formData.goalAmount || 0,
                token?.decimals || 18
              )
            )
            : BigInt(
              parseTokenAmount(
                formData.minInvestment || 0,
                token?.decimals || 18
              )
            ),
        maxDeposits: BigInt(
          formData.campaignType === "Invest"
            ? formData.maxDeposits
              ? Number(formData.maxDeposits)
              : 0
            : 0
        ),
        token: tokenAddress as `0x${string}`,
        title: formData.title,
        website: formData.website || "",
      };

       const formDataToSubmit = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "imageFile" && typeof value === "string") {
            const file = dataURLToFile(value, "uploaded-image.png");
            formDataToSubmit.append("image", file);
          } else if (key === "imageUrl" && typeof value === "string") {
            formDataToSubmit.append("imageUrl", value);
          } if (key === "pdfFile" && value instanceof File) {
            formDataToSubmit.append("pdf", value);
          } else if (key === "endTime" && value instanceof Date) {
            formDataToSubmit.append(key, value.toISOString());
          } else {
            formDataToSubmit.append(key, String(value));
          }
        }
      });
      if (!formDataToSubmit.get("imageUrl") && !formDataToSubmit.get("image"))
        throw new Error("Campaign Image is required");

      formDataToSubmit.append("campaignAddress", "");
      const res = await fetch(`${API_URL}/api/campaigns`, {
        method: "POST",
        body: formDataToSubmit,
      });
      if (!res.ok) throw new Error("Failed to submit campaign to backend");

      const creationFeeis = await campaignFactoryContract.read.getETHForUSDC();

      // console.log(
      //   creationFeeis,
      //   BigInt(creationFeeis?.toString()),
      //   chain.contracts.factory
      // );

      const { request } = await publicClient.simulateContract({
        address: chain.contracts.factory as `0x${string}`,
        abi: abi.Factory,
        functionName: "createCampaign",
        args: [params],
        account: walletClient.account,
        value: creationFeeis,
        gas: BigInt(5000000),
      });
      const tx = await walletClient.writeContract(request);

      return tx;
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCampaign, isLoading };
}
