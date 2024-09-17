import { API_URLS } from "@/constant/api.constant";
import {
    IApiProductOnStock,
    IProduct,
    IProductInfo,
    IProductOnStock,
} from "@/interface/product.interface";
import { apiCall } from "../apiCall";

/** @FEATURED_PRODUCT */
export const featureProducts = async () => {
    const api = API_URLS.PRODUCT.FEATURED();

    const resApi = await apiCall<IProduct[]>({ ...api });

    return resApi;
};

/** @PRODUCT_DETAIL */
export const productDetail = async (id: string) => {
    const api = API_URLS.PRODUCT.DETAIL(id);

    const resApi = await apiCall<IProductInfo>({ ...api });

    return resApi;
};

/** @ON_STOCK */
export const productOnStock = async (body: IApiProductOnStock) => {
    const api = API_URLS.PRODUCT.ON_STOCK();

    const resApi = await apiCall<IProductOnStock>({ ...api, payload: body });

    return resApi;
};
