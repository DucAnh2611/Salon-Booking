import { API_URLS } from "@/constant/api.constant";
import { ICategory, ICategoryTree } from "@/interface/category.interface";
import { apiCall } from "../apiCall";

/** @GET_CATEGORY_TREE */
export const getCategoryTree = async () => {
    const api = API_URLS.CATEGORY.TREE();

    const resApi = await apiCall<ICategoryTree[]>({ ...api });

    return resApi;
};

/** @GET_CATEGORY_LIST */
export const getCategoryList = async () => {
    const api = API_URLS.CATEGORY.LIST();

    const resApi = await apiCall<ICategory[]>({ ...api });

    return resApi;
};
