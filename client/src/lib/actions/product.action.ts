import { API_URLS } from "@/constant/api.constant";
import {
    IApiProductOnStock,
    IApiSearchProduct,
    IProductInfo,
    IProductItemFeature,
    IProductOnStock,
    IRelatedProductResponse,
    ISearchProductResponse,
} from "@/interface/product.interface";
import { apiCall } from "../apiCall";

/** @FEATURED_PRODUCT */
export const featureProducts = async () => {
    const api = API_URLS.PRODUCT.FEATURED();

    const resApi = await apiCall<IProductItemFeature[]>({ ...api });

    return resApi;
};

/** @RELATED_PRODUCT */
export const relatedProducts = async (id: string) => {
    const api = API_URLS.PRODUCT.RELATED(id);

    const resApi = await apiCall<IRelatedProductResponse>({ ...api });

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

/** @FIND */
export const findProduct = async (body: IApiSearchProduct) => {
    const api = API_URLS.PRODUCT.FIND();

    const resApi = await apiCall<ISearchProductResponse>({
        ...api,
        payload: body,
    });

    return resApi;
};
