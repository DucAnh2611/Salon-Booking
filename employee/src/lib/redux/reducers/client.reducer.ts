import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import {
    IActionDedicateClient,
    IInitialStateClient,
} from "@/interface/redux/client.interface";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";

const initialState: IInitialStateClient = {
    isUpdating: false,
    reload: false,
    clients: [],
    page: 1,
    limit: 10,
    count: 0,
    filter: {},
    order: {},
    isCalling: false,
    isFailure: false,
};

export const clientReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateClient
): IInitialStateClient => {
    const { type, state: stateAction, ...props } = action;
    switch (action.type) {
        case EReduxType.LIST_CLIENT:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    ...props,
                    isCalling: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    ...props,
                    reload: false,
                    isCalling: false,
                    isFailure: false,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    ...props,
                    isCalling: false,
                    isFailure: true,
                };
            }
            return state;

        case EReduxType.UPDATE_CLIENT_LOCK:
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
                    reload: true,
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

        case EReduxType.RELOAD_CLIENT:
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    reload: true,
                    isUpdating: false,
                    isFailure: false,
                };
            }
            return state;

        default:
            return state;
    }
};
