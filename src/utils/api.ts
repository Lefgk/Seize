import { API_URL } from "@/config";
import { ApiCampaign } from "@/types/campaign";

export const apiUploadUrl = (url: string) => {
    return url.startsWith("/uploads") ? `${API_URL}${url}` : url
}

export const fetchApiCampaign = async (title: string): Promise<ApiCampaign | null> => {
    try {
        const res = await fetch(`${API_URL}/api/campaigns/${title}`);
        const resJson = await res.json()
        return resJson
    } catch (e) {
        console.log(e);
        return null
    }
};
