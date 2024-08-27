import { API_URLS } from "@/constant/api.constant";
import { IProduct } from "@/interface/product.interface";
import { apiCall } from "../apiCall";

/** @FEATURED_PRODUCT */
export const featureProducts = async () => {
    const api = API_URLS.PRODUCT.FEATURED();

    const resApi = await apiCall<IProduct[]>({ ...api });

    return resApi;
};
