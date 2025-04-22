import { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

// Move schema and validation outside the function
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

export const useCampaignCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const createCampaign = async (data: CampaignFormData, form: any) => {
    setIsLoading(true); // <- Add this line
    try {
      console.log(data);
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create campaign");
      }

      toast.success("Campaign created successfully! 🎉");
      form.reset();
      return response.json();
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
      throw error;
    } finally {
      setIsLoading(false); // <- Add this line
    }
  };

  return { createCampaign, isLoading };
};
