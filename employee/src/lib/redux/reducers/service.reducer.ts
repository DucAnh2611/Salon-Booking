import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";
import {
    IActionDedicateService,
    IInitialStateService,
} from "@/interface/redux/service.interface";

const initialState: IInitialStateService = {
    isDeleting: false,
    isUpdating: false,
    isCreating: false,
    reload: false,
    isCalling: false,
    isFailure: false,
    services: [],
    deleteItems: [],
    detail: null,
    count: 0,
    page: 0,
    limit: 0,
    key: "",
    orderBy: "",
};

export const serviceReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateService
): IInitialStateService => {
    switch (action.type) {
        case EReduxType.SERVICE_DETAIL:
            if (isCallingApi(action)) {
                return {
                    ...state,
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

        case EReduxType.SERVICE_LIST:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isCalling: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                const { type, state: actionState, ...payload } = action;

                return {
                    ...state,
                    ...payload,
                    deleteItems: [],
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

        case EReduxType.SERVICE_LIST_PARAM:
            if (isSuccessfulApiCall(action)) {
                const { type, state: actionState, ...payload } = action;
                return {
                    ...state,
                    ...payload,
                };
            }

            return state;

        case EReduxType.SERVICE_CREATE:
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

        case EReduxType.SERVICE_UPDATE:
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

        case EReduxType.SERVICE_DELETE_LIST:
            if (isSuccessfulApiCall(action)) {
                const { type, state: actionState, ...payload } = action;
                return {
                    ...state,
                    ...payload,
                };
            }

            return state;

        case EReduxType.SERVICE_DELETE:
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
                    deleteItems: [],
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
