import { API_URLS } from "@/constant/api.constant";
import {
    IApiCancelTransaction,
    IApiSuccessTransaction,
    ITransactionOrder,
} from "@/interface/transaction.interface";
import { apiCall } from "../apiCall";

/** @GET_PAYMEBNT_LINK_PRODUCT */
export const getPaymentLinkProduct = async (id: string) => {
    const api = API_URLS.TRANSACTION.GET_LINK_PRODUCT(id);

    const resApi = await apiCall<ITransactionOrder>({
        ...api,
    });

    return resApi;
};

/** @CANCEL_TRANSACTION */
export const cancelTransaction = async (
    orderId: string,
    query: IApiCancelTransaction
) => {
    const api = API_URLS.TRANSACTION.CANCEL(orderId, query);

    const resApi = await apiCall({
        ...api,
    });

    return resApi;
};

/** @SUCCESS_TRANSACTION */
export const successTransaction = async (
    orderId: string,
    query: IApiSuccessTransaction
) => {
    const api = API_URLS.TRANSACTION.SUCCESS(orderId, query);

    const resApi = await apiCall({
        ...api,
    });

    return resApi;
};
