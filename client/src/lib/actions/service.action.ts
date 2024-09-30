import { API_URLS } from "@/constant/api.constant";
import {
    IApiSearchService,
    IRelatedServiceResponse,
    ISearchServiceResponse,
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

/** @RELATED_PRODUCT */
export const relatedServices = async (id: string) => {
    const api = API_URLS.SERVICE.RELATED(id);

    const resApi = await apiCall<IRelatedServiceResponse>({ ...api });

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

    const resApi = await apiCall<ISearchServiceResponse>({
        ...api,
        payload: body,
    });

    return resApi;
};
