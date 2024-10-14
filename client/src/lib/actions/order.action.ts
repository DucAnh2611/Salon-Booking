import { API_URLS } from "@/constant/api.constant";
import { IOrderState } from "@/interface/order-state.interface";
import {
    IApiCancelOrder,
    IApiCancelRefund,
    IApiListOrder,
    IOrderDetail,
    IOrderSearchResponse,
    IPlaceOrderProduct,
    IPlaceOrderResponse,
    IPlaceOrderService,
} from "@/interface/order.interface";
import { IProductItemOrder } from "@/interface/product.interface";
import { IRefundOrder } from "@/interface/refund.interface";
import { IserviceItemOrder } from "@/interface/service.interface";
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

    const resApi = await apiCall<IserviceItemOrder[]>({
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

/** @CANCEL_ORDER */
export const cancelOrder = async (body: IApiCancelOrder) => {
    const api = API_URLS.ORDER.CANCEL();

    const resApi = await apiCall({
        ...api,
        payload: body,
    });

    return resApi;
};

/** @RECEIVE_ORDER */
export const receiveOrder = async (id: string) => {
    const api = API_URLS.ORDER.RECEIVE(id);

    const resApi = await apiCall({
        ...api,
    });

    return resApi;
};

/** @RETURN_ORDER */
export const returnOrder = async (id: string) => {
    const api = API_URLS.ORDER.RETURN(id);

    const resApi = await apiCall({
        ...api,
    });

    return resApi;
};

/** @cONFIRM_ORDER */
export const confirmOrder = async (id: string) => {
    const api = API_URLS.ORDER.CONFIRM(id);

    const resApi = await apiCall({
        ...api,
    });

    return resApi;
};

/** @CANCEL_REFUND */
export const cancelRefund = async (body: IApiCancelRefund) => {
    const api = API_URLS.REFUND.CANCEL();

    const resApi = await apiCall({
        ...api,
        payload: body,
    });

    return resApi;
};

/** @RECEIVE_REFUND */
export const receiveRefund = async (id: string) => {
    const api = API_URLS.REFUND.RECEIVE(id);

    const resApi = await apiCall({
        ...api,
    });

    return resApi;
};

/** @PLACE_ORDER_SERVICE  */
export const placeOrderService = async (body: IPlaceOrderService) => {
    const api = API_URLS.ORDER.PLACE_SERVICE();

    const resApi = await apiCall<IPlaceOrderResponse>({
        ...api,
        payload: body,
    });

    return resApi;
};

/** @EXPIRED_ORDER */
export const expiredOrderService = async (id: string) => {
    const api = API_URLS.ORDER.EXPIRED_ORDER(id);

    const resApi = await apiCall({
        ...api,
    });

    return resApi;
};
