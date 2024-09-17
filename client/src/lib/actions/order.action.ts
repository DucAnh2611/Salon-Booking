import { API_URLS } from "@/constant/api.constant";
import { IOrderState } from "@/interface/order-state.interface";
import {
    IApiListOrder,
    IOrderDetail,
    IOrderSearchResponse,
    IPlaceOrderProduct,
    IPlaceOrderResponse,
} from "@/interface/order.interface";
import { IProductItemOrder } from "@/interface/product.interface";
import { IRefundOrder } from "@/interface/refund.interface";
import { ITransactionOrder } from "@/interface/transaction.interface";
import { apiCall } from "../apiCall";

/** @SEARCH_ORDER */
export const searchOrder = async (body: IApiListOrder) => {
    const api = API_URLS.ORDER.SEARCH();

    const resApi = await apiCall<IOrderSearchResponse>({
        ...api,
        payload: body,
    });

    return resApi;
};

/** @TRACKING_ORDER */
export const trackingOrder = async (code: string) => {
    const api = API_URLS.ORDER.TRACKING(code);

    const resApi = await apiCall<IOrderDetail>({
        ...api,
    });

    return resApi;
};

/** @TRACKING_ORDER_STATE */
export const trackingOrderState = async (id: string) => {
    const api = API_URLS.ORDER.TRACKING_STATE(id);

    const resApi = await apiCall<IOrderState[]>({
        ...api,
    });

    return resApi;
};

/** @TRACKING_ORDER_REFUND */
export const trackingOrderRefund = async (id: string) => {
    const api = API_URLS.ORDER.TRACKING_REFUND(id);

    const resApi = await apiCall<IRefundOrder[]>({
        ...api,
    });

    return resApi;
};

/** @TRACKING_ORDER_TRANSACTION */
export const trackingOrderTransaction = async (id: string) => {
    const api = API_URLS.ORDER.TRACKING_TRANSACTION(id);

    const resApi = await apiCall<ITransactionOrder[]>({
        ...api,
    });

    return resApi;
};

/** @TRACKING_ORDER_PRODUCT */
export const trackingOrderProduct = async (id: string) => {
    const api = API_URLS.ORDER.TRACKING_PRODUCT(id);

    const resApi = await apiCall<IProductItemOrder[]>({
        ...api,
    });

    return resApi;
};

/** @TRACKING_ORDER_SERVICE */
export const trackingOrderService = async (id: string) => {
    const api = API_URLS.ORDER.TRACKING_SERVICE(id);

    const resApi = await apiCall({
        ...api,
    });

    return resApi;
};

/** @PLACE_ORDER_PRODUCT  */
export const placeOrderProduct = async (body: IPlaceOrderProduct) => {
    const api = API_URLS.ORDER.PLACE_PRODUCT();

    const resApi = await apiCall<IPlaceOrderResponse>({
        ...api,
        payload: body,
    });

    return resApi;
};
