import { API_URLS } from "@/constant/api.constant";
import { IBank } from "@/interface/bank.interface";
import { apiCall } from "../apiCall";

/** @GET_BANKS_LIST */
export const bankList = async () => {
    const api = API_URLS.BANK.LIST();

    const resApi = await apiCall<IBank[]>({ ...api });

    return resApi;
};
