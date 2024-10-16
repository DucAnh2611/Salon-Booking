import { API_URLS } from "@/constants/api.constant";
import { EOrderStatus, EOrderType } from "@/enum/order.enum";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import {
    IApiCancelKeepFeeOrder,
    IApiUpdateOrderState,
} from "@/interface/api/order-state.interface";
import { IActionDedicateOrderState } from "@/interface/redux/order-state.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @ORDER_STATE_LIST */
const listOrderStateType = EReduxType.LIST_ORDER_STATE;
export const listOrderState =
    (type: EOrderType) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.ORDER_STATE.LIST(type);

        dispatch(
            isDispatchCalling<IActionDedicateOrderState>(listOrderStateType, {
                typeState: type,
            })
        );

        const { response } = await apiCall<EOrderStatus[]>({ ...api });

        if (response) {
            dispatch(
                isDispatchSuccess<IActionDedicateOrderState>(
                    listOrderStateType,
                    { items: response.result }
                )
            );
        } else {
            dispatch(isDispatchFailed(listOrderStateType));
        }
    };

/** @UPDATE_ORDER_STATE */
const updateOrderStateType = EReduxType.UPDATE_ORDER_STATE;
export const updateOrderState =
    (body: IApiUpdateOrderState) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.ORDER_STATE.UPDATE();

        dispatch(isDispatchCalling(updateOrderStateType));

        const { response } = await apiCall({ ...api, payload: body });

        if (response) {
            dispatch(isDispatchSuccess(updateOrderStateType));
        } else {
            dispatch(isDispatchFailed(updateOrderStateType));
        }
    };

/** @CANCEL_KEEP_FEE */
const cancelKeepFeeType = EReduxType.CANCEL_KEEP_FEE;
export const cancelKeepFee =
    (body: IApiCancelKeepFeeOrder) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.ORDER_STATE.CANCEL_KEEP_FEE();

        dispatch(isDispatchCalling(cancelKeepFeeType));

        const { response } = await apiCall({ ...api, payload: body });

        if (response) {
            dispatch(isDispatchSuccess(cancelKeepFeeType));
        } else {
            dispatch(isDispatchFailed(cancelKeepFeeType));
        }
    };
