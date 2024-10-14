import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";
import {
    IActionDedicateOrderRefund,
    IInitialStateOrderRefund,
} from "@/interface/redux/oder-refund.interface";

const inititalState: IInitialStateOrderRefund = {
    isCalling: false,
    isFailure: false,
    isApproving: false,
    isDeclining: false,
    detail: null,
};

export const orderRefundReducer = (
    state = inititalState,
    action: IDispatchDedicateRedux & IActionDedicateOrderRefund
): typeof inititalState => {
    const { state: actionState, type, ...props } = action;
    switch (action.type) {
        case EReduxType.GET_ORDER_REFUND:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isCalling: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    ...props,
                    isCalling: false,
                    isFailure: false,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    isCalling: false,
                    isFailure: true,
                };
            }
            return state;

        case EReduxType.DECLINE_ORDER_REFUND:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isDeclining: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    isDeclining: false,
                    isFailure: false,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    isDeclining: false,
                    isFailure: true,
                };
            }
            return state;

        case EReduxType.APPROVE_ORDER_REFUND:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isApproving: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    isApproving: false,
                    isFailure: false,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    isApproving: false,
                    isFailure: true,
                };
            }
            return state;

        default:
            return state;
    }
};
