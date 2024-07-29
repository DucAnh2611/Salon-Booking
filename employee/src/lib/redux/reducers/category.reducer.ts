import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import {
    IActionDedicateCategory,
    IInitialStateCategoy,
} from "@/interface/redux/category.interface";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";

const initialState: IInitialStateCategoy = {
    items: [],
    page: 1,
    limit: 10,
    count: 0,
    key: "",
    orderBy: "",
    deleteItems: [],
    isCalling: false,
    isFailure: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    reload: false,
};

export const categoryReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateCategory
): IInitialStateCategoy => {
    switch (action.type) {
        case EReduxType.CATEGORY_LIST:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    limit: action.limit || state.limit,
                    page: action.page || state.page,
                    key: action.key || state.key,
                    orderBy: action.orderBy || state.orderBy,
                    isCalling: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    items: action.items || [],
                    count: action.count || state.count,
                    deleteItems: [],
                    isCalling: false,
                    isFailure: false,
                    reload: false,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    items: [],
                    count: 0,
                    isCalling: false,
                    isFailure: true,
                    reload: false,
                };
            }
            return state;

        case EReduxType.CATEGORY_CREATE:
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
                    page: 1,
                    isCreating: false,
                    isFailure: false,
                    reload: true,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    isCreating: true,
                    isFailure: true,
                };
            }
            return state;

        case EReduxType.CATEGORY_UPDATE:
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
                    page: 1,
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

        case EReduxType.CATEGORY_DELETE:
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
                    page: 1,
                    deleteItems: [],
                    isDeleting: false,
                    isFailure: false,
                    reload: true,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    isDeleting: true,
                    isFailure: true,
                };
            }
            return state;

        case EReduxType.CATEGORY_DELETE_LIST:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    deleteItems: action.deleteItems || state.deleteItems,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    deleteItems: action.deleteItems || state.deleteItems,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    deleteItems: state.deleteItems,
                };
            }
            return state;

        default:
            return state;
    }
};
