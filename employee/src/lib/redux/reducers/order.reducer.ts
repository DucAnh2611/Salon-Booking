import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";
import {
    IActionDedicateOrder,
    IInitialStateOrder,
} from "@/interface/redux/order.interface";

const initialState: IInitialStateOrder = {
    reload: false,
    isCalling: false,
    isFailure: false,
    orders: [],
    page: 1,
    limit: 10,
    count: 0,
    filter: {},
    sort: {},
};

export const orderReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateOrder
): IInitialStateOrder => {
    switch (action.type) {
        case EReduxType.ORDER_LIST:
            if (isCallingApi(action)) {
                const { type, state: actionState, ...props } = action;
                return {
                    ...state,
                    ...props,
                    isCalling: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                const { type, state: actionState, ...props } = action;
                return {
                    ...state,
                    ...props,
                    isCalling: false,
                    isFailure: false,
                };
            }
            if (isFailedApiCall(action)) {
                const { type, state: actionState, ...props } = action;
                return {
                    ...state,
                    ...props,
                    isCalling: false,
                    isFailure: true,
                };
            }
            return state;

        default:
            return state;
    }
};
