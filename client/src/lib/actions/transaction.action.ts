import { API_URLS } from "@/constant/api.constant";
import {
    IApiCancelTransaction,
    IApiFailTransaction,
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

/** @FAIL_TRANSACTION */
export const failTransaction = async (
    orderId: string,
    query: IApiFailTransaction
) => {
    const api = API_URLS.TRANSACTION.FAIL(orderId, query);

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

/** @CANCEL_TRANSACTION */
export const cancelTransaction = async (
    orderId: string,
    body: IApiCancelTransaction
) => {
    const api = API_URLS.TRANSACTION.CANCEL(orderId);

    const resApi = await apiCall({
        ...api,
        payload: body,
    });

    return resApi;
};
