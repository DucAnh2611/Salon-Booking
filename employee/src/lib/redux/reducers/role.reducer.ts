import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";
import {
    IActionDedicateRole,
    IInitialStateRole,
} from "@/interface/redux/role.interface";

const initialState: IInitialStateRole = {
    roles: [],
    deleteItems: [],
    detail: null,
    key: "",
    limit: 10,
    orderBy: "",
    page: 1,
    count: 0,
    isDeleting: false,
    isUpdating: false,
    isCreating: false,
    isCalling: false,
    isFailure: false,
    reload: false,
};

export const roleReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateRole
): IInitialStateRole => {
    switch (action.type) {
        case EReduxType.ROLE_LIST:
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
                    page: action.page || state.page,
                    limit: action.limit || state.limit,
                    count: action.count || state.count,
                    key: action.key !== undefined ? action.key : state.key,
                    orderBy:
                        action.orderBy !== undefined
                            ? action.orderBy
                            : state.orderBy,
                    roles: action.roles || state.roles,
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
                    reload: false,
                };
            }
            return state;

        case EReduxType.ROLE_DETAIL:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    detail: null,
                    isCalling: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    detail: action.detail || null,
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

        case EReduxType.ROLE_UPDATE:
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

        case EReduxType.ROLE_CREATE:
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

        case EReduxType.ROLE_DELETE_LIST:
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    deleteItems: action.deleteItems || [],
                };
            }
            return state;

        case EReduxType.ROLE_DELETE:
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
