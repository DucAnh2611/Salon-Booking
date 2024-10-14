import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import { IOrderRefundRequest } from "@/interface/api/order-refund.interface";
import {
    IApiApproveRefund,
    IApiDeclineRefund,
} from "@/interface/api/refund.interface";
import { IActionDedicateOrderRefund } from "@/interface/redux/oder-refund.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @GET_ORDER_REFUND */
const getOrderRefundType = EReduxType.GET_ORDER_REFUND;
export const getOrderRefund =
    (id: string) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.REFUND.GET(id);

        dispatch(isDispatchCalling(getOrderRefundType));

        const { response } = await apiCall<IOrderRefundRequest>({ ...api });

        if (response) {
            dispatch(
                isDispatchSuccess<IActionDedicateOrderRefund>(
                    getOrderRefundType,
                    { detail: response.result }
                )
            );
        } else {
            dispatch(isDispatchFailed(getOrderRefundType));
        }
    };

/** @APPROVE_ORDER_REFUND */
const approveOrderRefundType = EReduxType.APPROVE_ORDER_REFUND;
export const approveOrderRefund =
    (body: IApiApproveRefund) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.REFUND.APPROVE();

        dispatch(isDispatchCalling(approveOrderRefundType));

        const { response } = await apiCall({ ...api, payload: body });

        if (response) {
            dispatch(isDispatchSuccess(approveOrderRefundType));
        } else {
            dispatch(isDispatchFailed(approveOrderRefundType));
        }
    };

/** @DECLINE_ORDER_REFUND */
const declineOrderRefundType = EReduxType.DECLINE_ORDER_REFUND;
export const declineOrderRefund =
    (body: IApiDeclineRefund) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.REFUND.DECLINE();

        dispatch(isDispatchCalling(declineOrderRefundType));

        const { response } = await apiCall({ ...api, payload: body });

        if (response) {
            dispatch(isDispatchSuccess(declineOrderRefundType));
        } else {
            dispatch(isDispatchFailed(declineOrderRefundType));
        }
    };
