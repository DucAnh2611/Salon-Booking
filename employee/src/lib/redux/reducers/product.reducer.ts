import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";
import {
    IActionDedicateProduct,
    IInitialStateProduct,
} from "@/interface/redux/product.interface";

const initialState: IInitialStateProduct = {
    products: [],
    deleteItems: [],
    page: 0,
    limit: 0,
    count: 0,
    key: "",
    orderBy: "",
    detail: null,
    isDeleting: false,
    isUpdating: false,
    isCreating: false,
    reload: false,
    isCalling: false,
    isFailure: false,
};

export const productReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateProduct
): IInitialStateProduct => {
    switch (action.type) {
        case EReduxType.PRODUCT_LIST_PARAM:
            if (isSuccessfulApiCall(action)) {
                const { type, state: actionState, ...newState } = action;
                return {
                    ...state,
                    ...newState,
                };
            }
            return state;

        case EReduxType.PRODUCT_LIST:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isCalling: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                const { type, state: actionState, ...newState } = action;
                return {
                    ...state,
                    ...newState,
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

        case EReduxType.PRODUCT_DETAIL:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isCalling: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                const { type, state: actionState, ...newState } = action;
                return {
                    ...state,
                    ...newState,
                    isCalling: false,
                    isFailure: false,
                    reload: false,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    detail: null,
                    isCalling: false,
                    isFailure: true,
                };
            }
            return state;

        case EReduxType.PRODUCT_CREATE:
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

        case EReduxType.PRODUCT_DELETE_LIST:
            if (isSuccessfulApiCall(action)) {
                const { type, state: actionState, ...newState } = action;
                return {
                    ...state,
                    ...newState,
                };
            }
            return state;

        case EReduxType.PRODUCT_DELETE:
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

        case EReduxType.PRODUCT_UPDATE:
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

        default:
            return state;
    }
};
