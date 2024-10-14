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
};

export const orderRefundReducer = (
    state = inititalState,
    action: IDispatchDedicateRedux & IActionDedicateOrderRefund
): typeof inititalState => {
    switch (action.type) {
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
