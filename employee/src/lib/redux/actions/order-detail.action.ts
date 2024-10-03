import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import {
    IOrderDetail,
    IOrderDetailRefund,
    IOrderDetailState,
    IOrderDetailTransaction,
} from "@/interface/api/order-detail.interface";
import { IProductItemOrder } from "@/interface/api/product.interface";
import { IServiceItemOrder } from "@/interface/api/service.interface";
import { IActionDedicateOrderDetail } from "@/interface/redux/order-detail.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @ORDER_DETAIL */
const detailOrderType = EReduxType.ORDER_DETAIL;
export const detailOrder = (id: string) => async (dispath: TAppDispatch) => {
    const api = API_URLS.ORDER_PRODUCT.DETAIL(id);

    dispath(isDispatchCalling<IActionDedicateOrderDetail>(detailOrderType));

    const { response } = await apiCall<IOrderDetail>({
        ...api,
    });

    if (response) {
        dispath(
            isDispatchSuccess<IActionDedicateOrderDetail>(detailOrderType, {
                base: { base: response.result },
            })
        );
    } else {
        dispath(isDispatchFailed<IActionDedicateOrderDetail>(detailOrderType));
    }
};

/** @ORDER_STATE_LIST */
const detailOrderStateType = EReduxType.ORDER_STATE_LIST;
export const detailOrderState =
    (id: string) => async (dispath: TAppDispatch) => {
        const api = API_URLS.ORDER_PRODUCT.STATE(id);

        dispath(
            isDispatchCalling<IActionDedicateOrderDetail>(detailOrderStateType)
        );

        const { response } = await apiCall<IOrderDetailState[]>({
            ...api,
        });

        if (response) {
            dispath(
                isDispatchSuccess<IActionDedicateOrderDetail>(
                    detailOrderStateType,
                    {
                        status: { states: response.result },
                    }
                )
            );
        } else {
            dispath(
                isDispatchFailed<IActionDedicateOrderDetail>(
                    detailOrderStateType
                )
            );
        }
    };

/** @ORDER_RELOAD_STATE */
const reloadOrderStateType = EReduxType.ORDER_RELOAD_STATE;
export const reloadOrderState = () => async (dispath: TAppDispatch) => {
    dispath(
        isDispatchSuccess<IActionDedicateOrderDetail>(reloadOrderStateType)
    );
};

/** @ORDER_TRANSACTION_LIST */
const detailOrderTransactionType = EReduxType.ORDER_TRANSACTION_LIST;
export const detailOrderTransaction =
    (id: string) => async (dispath: TAppDispatch) => {
        const api = API_URLS.ORDER_PRODUCT.TRANSACTION(id);

        dispath(
            isDispatchCalling<IActionDedicateOrderDetail>(
                detailOrderTransactionType
            )
        );

        const { response } = await apiCall<IOrderDetailTransaction[]>({
            ...api,
        });

        if (response) {
            dispath(
                isDispatchSuccess<IActionDedicateOrderDetail>(
                    detailOrderTransactionType,
                    {
                        transaction: { transactions: response.result },
                    }
                )
            );
        } else {
            dispath(
                isDispatchFailed<IActionDedicateOrderDetail>(
                    detailOrderTransactionType
                )
            );
        }
    };

/** @ORDER_REFUND_LIST */
const detailOrderRefundType = EReduxType.ORDER_REFUND_LIST;
export const detailOrderRefund =
    (id: string) => async (dispath: TAppDispatch) => {
        const api = API_URLS.ORDER_PRODUCT.REFUND(id);

        dispath(
            isDispatchCalling<IActionDedicateOrderDetail>(detailOrderRefundType)
        );

        const { response } = await apiCall<IOrderDetailRefund[]>({
            ...api,
        });

        if (response) {
            dispath(
                isDispatchSuccess<IActionDedicateOrderDetail>(
                    detailOrderRefundType,
                    {
                        refund: { refunds: response.result },
                    }
                )
            );
        } else {
            dispath(
                isDispatchFailed<IActionDedicateOrderDetail>(
                    detailOrderRefundType
                )
            );
        }
    };

/** @ORDER_PRODUCT_LIST */
const detailOrderProductType = EReduxType.ORDER_PRODUCT_LIST;
export const detailOrderProduct =
    (id: string) => async (dispath: TAppDispatch) => {
        const api = API_URLS.ORDER_PRODUCT.PRODUCT(id);

        dispath(
            isDispatchCalling<IActionDedicateOrderDetail>(
                detailOrderProductType
            )
        );

        const { response } = await apiCall<IProductItemOrder[]>({
            ...api,
        });

        if (response) {
            dispath(
                isDispatchSuccess<IActionDedicateOrderDetail>(
                    detailOrderProductType,
                    {
                        product: { products: response.result },
                    }
                )
            );
        } else {
            dispath(
                isDispatchFailed<IActionDedicateOrderDetail>(
                    detailOrderProductType
                )
            );
        }
    };

/** @ORDER_SERVICE_LIST */
const detailOrderServiceType = EReduxType.ORDER_SERVICE_LIST;
export const detailOrderService =
    (id: string) => async (dispath: TAppDispatch) => {
        const api = API_URLS.ORDER_PRODUCT.SERVICE(id);

        dispath(
            isDispatchCalling<IActionDedicateOrderDetail>(
                detailOrderServiceType
            )
        );

        const { response } = await apiCall<IServiceItemOrder[]>({
            ...api,
        });

        if (response) {
            dispath(
                isDispatchSuccess<IActionDedicateOrderDetail>(
                    detailOrderServiceType,
                    {
                        service: { services: response.result },
                    }
                )
            );
        } else {
            dispath(
                isDispatchFailed<IActionDedicateOrderDetail>(
                    detailOrderServiceType
                )
            );
        }
    };
