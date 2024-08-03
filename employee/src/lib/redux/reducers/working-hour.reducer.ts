import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";
import {
    IActionDedicateWorkingHour,
    IInitialStateWorkingHour,
} from "@/interface/redux/working-hour.interface";

const initialState: IInitialStateWorkingHour = {
    reload: false,
    workingHours: [],
    detail: null,
    count: 0,
    isDeleting: false,
    isUpdating: false,
    isCreating: false,
    isCalling: false,
    isFailure: false,
};

export const workingHourReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateWorkingHour
): IInitialStateWorkingHour => {
    switch (action.type) {
        case EReduxType.WORKING_HOUR_RANGE:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isCalling: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                const { state: actionState, type, ...payload } = action;
                return {
                    ...state,
                    ...payload,
                    isCalling: false,
                    isFailure: false,
                    reload: false,
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

        case EReduxType.WORKING_HOUR_DETAIL:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isCalling: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                const { state: actionState, type, ...payload } = action;
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

        case EReduxType.WORKING_HOUR_CREATE:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isCreating: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    isCreating: false,
                    isFailure: false,
                    reload: true,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    isCreating: false,
                    isFailure: true,
                };
            }

            return state;

        case EReduxType.WORKING_HOUR_UPDATE:
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
                    reload: true,
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

        case EReduxType.WORKING_HOUR_TOGGLE_OFF:
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
                    reload: true,
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

        case EReduxType.WORKING_HOUR_DELETE:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isDeleting: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    isDeleting: false,
                    isFailure: false,
                    reload: true,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    isDeleting: false,
                    isFailure: true,
                };
            }

            return state;

        default:
            return state;
    }
};
