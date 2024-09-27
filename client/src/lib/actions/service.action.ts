import { API_URLS } from "@/constant/api.constant";
import {
    IApiSearchService,
    ISearchserviceResponse,
    ISerivceItemFeature,
    IServiceDetail,
} from "@/interface/service.interface";
import { apiCall } from "../apiCall";

/** @FEATURED_SERVICE */
export const featureServices = async () => {
    const api = API_URLS.SERVICE.FEATURED();

    const resApi = await apiCall<ISerivceItemFeature[]>({ ...api });

    return resApi;
};

/** @DETAIL_SERVICE */
export const detailService = async (id: string) => {
    const api = API_URLS.SERVICE.DETAIL(id);

    const resApi = await apiCall<IServiceDetail>({ ...api });

    return resApi;
};

/** @DETAIL_SERVICE */
export const findService = async (body: IApiSearchService) => {
    const api = API_URLS.SERVICE.FIND();

    const resApi = await apiCall<ISearchserviceResponse>({
        ...api,
        payload: body,
    });

    return resApi;
};
