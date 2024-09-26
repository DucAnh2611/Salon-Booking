import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import {
    IApiApproveRefund,
    IApiDeclineRefund,
} from "@/interface/api/refund.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

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
