import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";
import {
    IActionDedicateOrderDetail,
    IInitialStateOrderDetail,
} from "@/interface/redux/order-detail.interface";

const initialState: IInitialStateOrderDetail = {
    base: {
        base: null,
        isCalling: false,
        isFailure: false,
        reload: false,
    },
    refund: {
        refunds: [],
        isCalling: false,
        isFailure: false,
    },
    status: {
        states: [],
        isCalling: false,
        isFailure: false,
        reload: false,
    },
    transaction: {
        transactions: [],
        isCalling: false,
        isFailure: false,
    },
    product: {
        products: [],
        isCalling: false,
        isFailure: false,
    },
    service: {
        services: [],
        isCalling: false,
        isFailure: false,
    },
};

export const orderDetailReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateOrderDetail
): IInitialStateOrderDetail => {
    switch (action.type) {
        case EReduxType.ORDER_DETAIL:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    base: {
                        ...state.base,
                        reload: false,
                        isCalling: true,
                        isFailure: false,
                    },
                    status: {
                        ...state.status,
                        states: [],
                    },
                    refund: {
                        ...state.refund,
                        refunds: [],
                    },
                    transaction: {
                        ...state.transaction,
                        transactions: [],
                    },
                    product: {
                        ...state.product,
                        products: [],
                    },
                    service: {
                        ...state.service,
                        services: [],
                    },
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    base: {
                        ...state.base,
                        ...action.base,
                        isCalling: false,
                        isFailure: false,
                    },
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    base: {
                        ...state.base,
                        base: null,
                        isCalling: false,
                        isFailure: true,
                    },
                };
            }
            return state;

        case EReduxType.ORDER_STATE_LIST:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    status: {
                        ...state.status,
                        reload: false,
                        isCalling: true,
                        isFailure: false,
                    },
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    status: {
                        ...state.status,
                        ...action.status,
                        isCalling: false,
                        isFailure: false,
                    },
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    status: {
                        ...state.status,
                        states: [],
                        isCalling: false,
                        isFailure: true,
                    },
                };
            }
            return state;

        case EReduxType.ORDER_RELOAD_STATE:
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    base: {
                        ...state.base,
                        reload: true,
                    },
                    status: {
                        ...state.status,
                        reload: true,
                    },
                };
            }
            return state;

        case EReduxType.ORDER_TRANSACTION_LIST:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    transaction: {
                        ...state.transaction,
                        isCalling: true,
                        isFailure: false,
                    },
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    transaction: {
                        ...state.transaction,
                        ...action.transaction,
                        isCalling: false,
                        isFailure: false,
                    },
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    transaction: {
                        ...state.transaction,
                        transactions: [],
                        isCalling: false,
                        isFailure: true,
                    },
                };
            }
            return state;

        case EReduxType.ORDER_REFUND_LIST:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    refund: {
                        ...state.refund,
                        isCalling: true,
                        isFailure: false,
                    },
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    refund: {
                        ...state.refund,
                        ...action.refund,
                        isCalling: false,
                        isFailure: false,
                    },
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    refund: {
                        ...state.refund,
                        refunds: [],
                        isCalling: false,
                        isFailure: true,
                    },
                };
            }
            return state;

        case EReduxType.ORDER_SERVICE_LIST:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    service: {
                        ...state.service,
                        isCalling: true,
                        isFailure: false,
                    },
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    service: {
                        ...state.service,
                        ...action.service,
                        isCalling: false,
                        isFailure: false,
                    },
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    service: {
                        ...state.service,
                        services: [],
                        isCalling: false,
                        isFailure: true,
                    },
                };
            }
            return state;

        case EReduxType.ORDER_PRODUCT_LIST:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    product: {
                        ...state.product,
                        isCalling: true,
                        isFailure: false,
                    },
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    product: {
                        ...state.product,
                        ...action.product,
                        isCalling: false,
                        isFailure: false,
                    },
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    product: {
                        ...state.product,
                        products: [],
                        isCalling: false,
                        isFailure: true,
                    },
                };
            }
            return state;

        default:
            return state;
    }
};
