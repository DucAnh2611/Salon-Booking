import { API_URLS } from "@/constant/api.constant";
import {
    IDistrict,
    IDistrictListQuery,
    IDistrictSearch,
    IDistrictSearchQuery,
    IProvince,
    IProvinceSearch,
    IProvinceSearchQuery,
    IWard,
    IWardListQuery,
    IWardSearch,
    IWardSearchQuery,
} from "@/interface/province.interface";
import { apiCall } from "../apiCall";

/** @LIST_PROVINCE */
export const listProvince = async () => {
    const api = API_URLS.PROVINCE.LIST_PROVINCE();

    const resApi = await apiCall<IProvince[]>({ ...api });

    return resApi;
};

/** @SEARCH_PROVINCE */
export const searchProvince = async (query: IProvinceSearchQuery) => {
    const api = API_URLS.PROVINCE.SEARCH_PROVINCE(query);

    const resApi = await apiCall<IProvinceSearch[]>({ ...api });

    return resApi;
};

/** @GET_PROVINCE */
export const getProvince = async (code: number) => {
    const api = API_URLS.PROVINCE.GET_PROVINCE(code);

    const resApi = await apiCall<IProvince>({ ...api });

    return resApi;
};

/** @LIST_DISTRICT */
export const listDistrict = async (query: IDistrictListQuery) => {
    const api = API_URLS.PROVINCE.LIST_DISTRICT(query);

    const resApi = await apiCall<IDistrict[]>({ ...api });

    return resApi;
};

/** @SEARCH_DISTRICT */
export const searchDistrict = async (query: IDistrictSearchQuery) => {
    const api = API_URLS.PROVINCE.SEARCH_DISTRICT(query);

    const resApi = await apiCall<IDistrictSearch[]>({ ...api });

    return resApi;
};

/** @GET_DISTRICT */
export const getDistrict = async (code: number) => {
    const api = API_URLS.PROVINCE.GET_DISTRICT(code);

    const resApi = await apiCall<IDistrict>({ ...api });

    return resApi;
};

/** @LIST_WARD */
export const listWard = async (query: IWardListQuery) => {
    const api = API_URLS.PROVINCE.LIST_WARD(query);

    const resApi = await apiCall<IWard[]>({ ...api });

    return resApi;
};

/** @SEARCH_WARD */
export const searchWard = async (query: IWardSearchQuery) => {
    const api = API_URLS.PROVINCE.SEARCH_WARD(query);

    const resApi = await apiCall<IWardSearch[]>({ ...api });

    return resApi;
};

/** @GET_WARD */
export const getWard = async (code: number) => {
    const api = API_URLS.PROVINCE.GET_WARD(code);

    const resApi = await apiCall<IWard>({ ...api });

    return resApi;
};
