import { API_URLS } from "@/constant/api.constant";
import { IService, IServiceDetail } from "@/interface/service.interface";
import { apiCall } from "../apiCall";

/** @FEATURED_SERVICE */
export const featureServices = async () => {
    const api = API_URLS.SERVICE.FEATURED();

    const resApi = await apiCall<IService[]>({ ...api });

    return resApi;
};

/** @DETAIL_SERVICE */
export const detailService = async (id: string) => {
    const api = API_URLS.SERVICE.DETAIL(id);

    const resApi = await apiCall<IServiceDetail>({ ...api });

    return resApi;
};
