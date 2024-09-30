import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import {
    IActionDedicateAuth,
    IInitialStateAuth,
} from "@/interface/redux/auth.interface";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";

const initialState: IInitialStateAuth = {
    authentication: false,
    user: null,
    retry: false,
    loginPayload: null,
    isCalling: false,
    isFailure: false,
};

const authReducer = (
    state: IInitialStateAuth = initialState,
    action: IActionDedicateAuth & IDispatchDedicateRedux
): IInitialStateAuth => {
    switch (action.type) {
        case EReduxType.AUTH_LOGIN:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    authentication: false,
                    loginPayload: action.loginPayload || null,
                    isCalling: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    authentication: true,
                    loginPayload: null,
                    isCalling: false,
                    isFailure: false,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    authentication: false,
                    isCalling: false,
                    isFailure: true,
                };
            }

            return state;
        case EReduxType.ME:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    user: null,
                    isCalling: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    authentication: true,
                    user: action.user || null,
                    isCalling: false,
                    isFailure: false,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    authentication: false,
                    user: null,
                    isCalling: false,
                    isFailure: true,
                };
            }

            return state;
        case EReduxType.AUTH_TOKEN:
            if (isCallingApi(action)) {
                return {
                    ...state,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    authentication: true,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    authentication: false,
                };
            }

            return state;
        case EReduxType.AUTH_LOGOUT:
            if (isCallingApi(action)) {
                return {
                    ...state,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    authentication: false,
                    user: null,
                    loginPayload: null,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                };
            }
            return state;
        default:
            return state;
    }
};

export default authReducer;
