"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { ImageUploader } from "@/components/ui/image-uploader";
import type { CampaignFormData } from "@/hooks/useCampaignCreation";
import {
  campaignFormSchema,
  useCampaignCreation,
} from "@/hooks/useCampaignCreation";
import { FaDiscord, FaTelegram, FaYoutube, FaTwitter } from "react-icons/fa";
import { MdEmail, MdLanguage } from "react-icons/md";
import Link from "next/link";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useMemo } from "react";
import { getShortErrorMessage } from "@/utils/helpers";
import { useChainData } from "@/hooks/useChainData";
import { PdfUploader } from "@/components/ui/pdf-uploader";

const investCategories = [
  { value: "crypto-related", label: "Crypto related" },
  { value: "personal-loan", label: "Personal Loan" },
  { value: "business-loan", label: "Business Loan" },
  { value: "start-up", label: "Start up funds" },
  { value: "real-estate", label: "Real Estate" },
  { value: "other", label: "Other" },
];
const donationCategories = [
  { value: "foundation", label: "Foundation" },
  { value: "group", label: "Group" },
  { value: "individual", label: "Individual" },
  { value: "other", label: "Other" },
];

export default function CampaignCreationForm() {
  const router = useRouter();
  const { createCampaign, isLoading } = useCampaignCreation();

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      campaignType: "Invest",
      category: "",
      token: "0x0000000000000000000000000000000000000000",
    },
  });
  if (typeof window !== "undefined") {
    // Safe to use 'File' here
  }
  const chain = useChainData();
  const campaignType = form.watch("campaignType");
  const tokenAddress = form.watch("token");
  const categories = useMemo(
    () => (campaignType === "Donate" ? donationCategories : investCategories),
    [campaignType]
  );

  useEffect(() => {
    if (!categories.some((z) => z.label === form.getValues("category")))
      form.setValue("category", categories[0].label);
  }, [categories]);

  useEffect(() => {
    form.reset({}, { keepValues: false, keepDefaultValues: true });
  }, [chain.chainId]);
  const onSubmit = async (data: CampaignFormData) => {
    try {
      console.log(data, form);
      await createCampaign(data, form);
      toast.success("Successfully started your campaign");
      router.push("/campaigns");
    } catch (e) {
      console.error("Failed to create campaign:", e);
      toast.error(
        getShortErrorMessage(e, "Failed to create campaign, Unknown Error")
      );
    }
  };

  return (
    <div className="w-full p-4 md:p-6">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Create Your Campaign</CardTitle>
          <CardDescription className="text-base">
            Bring your ideas to life and start fundraising
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="campaignType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Donate" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Donation
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Invest" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Investment
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a catchy title"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.label}
                              value={category.label}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel>PDF</FormLabel>
                <FormField
                  control={form.control}
                  name="pdfFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PdfUploader
                          value={field.value}
                          onChange={field.onChange}
                          className="h-40 w-full mt-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Tabs defaultValue="upload">
                <FormLabel>Campaign Image</FormLabel>
                <TabsList className="grid max-w-[400px] mt-2 w-full grid-cols-2 mb-4">
                  <TabsTrigger value="upload">
                    Upload{" "}
                    <span className="text-red-500 ml-1">(png or jpeg)</span>
                  </TabsTrigger>
                  <TabsTrigger value="url">URL</TabsTrigger>
                </TabsList>
                <TabsContent className="mt-0 py-0" value="upload">
                  <FormField
                    control={form.control}
                    name="imageFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUploader
                            value={field.value}
                            onChange={field.onChange}
                            className="h-40 w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="url">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Paste Image URL here.."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign End Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          setDate={(date: Date | undefined) =>
                            field.onChange(date)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accepted Token</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a token" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(chain.tokens).map(
                            ([address, x], i) => (
                              <SelectItem key={i} value={address}>
                                {x.symbol}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {campaignType === "Donate" ? (
                  <FormField
                    control={form.control}
                    name="goalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Funding Goal (
                          {chain.tokens?.[tokenAddress]?.symbol ||
                            chain.nativeToken}
                          )
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="minInvestment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Minimum Investment (
                            {chain.tokens?.[tokenAddress || ""]?.symbol ||
                              chain.nativeToken}
                            )
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxDeposits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Entries</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              <FormField
                control={form.control}
                name="story"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe your Campaign</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your campaign"
                        className="resize-none"
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="perks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perks (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="This is where you reward your investors, make sure to offer juicy enough incentives to your potential investors to get them to fill up your campaign."
                        {...field}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2 mt-4">
                <h3 className="text-lg font-semibold">Socials</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                              <MdEmail className="h-5 w-5" />
                            </span>
                            <Input
                              placeholder="example@gmail.com"
                              {...field}
                              value={field.value}
                              className="rounded-l-none"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discord"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discord</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                              <FaDiscord className="h-5 w-5" />
                            </span>
                            <Input
                              placeholder="https://discord.gg/x"
                              {...field}
                              value={field.value}
                              className="rounded-l-none"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telegram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telegram</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                              <FaTelegram className="h-5 w-5" />
                            </span>
                            <Input
                              placeholder="https://t.me/"
                              {...field}
                              value={field.value}
                              className="rounded-l-none"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube URL</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                              <FaYoutube className="h-5 w-5" />
                            </span>
                            <Input
                              placeholder="https://youtube.com/channel/example"
                              {...field}
                              value={field.value}
                              className="rounded-l-none"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                              <FaTwitter className="h-5 w-5" />
                            </span>
                            <Input
                              placeholder="https://x.com/seize"
                              {...field}
                              value={field.value}
                              className="rounded-l-none"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                              <MdLanguage className="h-5 w-5" />
                            </span>
                            <Input
                              placeholder="www.example.com"
                              {...field}
                              value={field.value}
                              className="rounded-l-none"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="acceptedTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Accept{" "}
                        <span>
                          <Link
                            className="text-primary cursor-pointer font-medium hover:underline"
                            href={"/terms-of-service"}
                            target="_blank"
                          >
                            terms and conditions
                          </Link>
                        </span>
                      </FormLabel>
                      <FormDescription>
                        You agree to our Terms of Service and Privacy Policy.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            type="submit"
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Campaign...
              </>
            ) : (
              "Create Campaign"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
