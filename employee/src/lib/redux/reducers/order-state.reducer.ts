import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";
import {
    IActionDedicateOrderState,
    IInitialStateOrderState,
} from "@/interface/redux/order-state.interface";

const inititalState: IInitialStateOrderState = {
    typeState: null,
    items: [],
    isCalling: false,
    isFailure: false,
    isUpdating: false,
};

export const orderStateReducer = (
    state = inititalState,
    action: IDispatchDedicateRedux & IActionDedicateOrderState
): IInitialStateOrderState => {
    switch (action.type) {
        case EReduxType.LIST_ORDER_STATE:
            if (isCallingApi(action)) {
                const { type, state: actionState, ...payload } = action;
                return {
                    ...state,
                    ...payload,
                    isCalling: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                const { type, state: actionState, ...payload } = action;
                return {
                    ...state,
                    ...payload,
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

        case EReduxType.UPDATE_ORDER_STATE:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isUpdating: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    isUpdating: false,
                    isFailure: false,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    isUpdating: false,
                    isFailure: true,
                };
            }
            return state;
        default:
            return state;
    }
};
