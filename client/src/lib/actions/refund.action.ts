import { API_URLS } from "@/constant/api.constant";
import { IRefundCreate } from "@/interface/refund.interface";
import { apiCall } from "../apiCall";

/** @CREATE_REQUETS_REFUND */
export const createRefundRequest = async (body: IRefundCreate) => {
    const api = API_URLS.REFUND.CREATE();

    const resApi = await apiCall({ ...api, payload: body });

    return resApi;
};
