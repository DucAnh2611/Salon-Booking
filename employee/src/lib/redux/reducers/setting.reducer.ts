import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";
import {
    IActionDedicateSetting,
    IInitialStateSetting,
} from "@/interface/redux/setting.interface";

export const initialState: IInitialStateSetting = {
    setting: null,
    isUpdating: false,
    isCalling: false,
    isFailure: false,
    isReseting: false,
};

export const settingReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateSetting
): IInitialStateSetting => {
    const { state: actionState, type, ...props } = action;

    switch (type) {
        case EReduxType.SETTING_GET:
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

        case EReduxType.SETTING_RESET:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isReseting: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    ...props,
                    isReseting: false,
                    isFailure: false,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    isReseting: false,
                    isFailure: true,
                };
            }
            return state;

        case EReduxType.SETTING_UPDATE:
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
                    ...props,
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
