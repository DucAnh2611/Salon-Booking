import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";
import {
    IActionDedicateEmployee,
    IInitialStateEmployee,
} from "@/interface/redux/employee.interface";

const initialState: IInitialStateEmployee = {
    page: 0,
    limit: 0,
    count: 0,
    key: "",
    orderBy: "",
    employees: [],
    deleteItems: [],
    detail: null,
    isDeleting: false,
    isUpdating: false,
    isCreating: false,
    reload: false,
    isCalling: false,
    isFailure: false,
};

export const employeeReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateEmployee
): IInitialStateEmployee => {
    switch (action.type) {
        case EReduxType.EMPLOYEE_LIST:
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
                    deleteItems: [],
                    employees: action.employees || state.employees,
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

        case EReduxType.EMPLOYEE_DELETE_LIST:
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    deleteItems: action.deleteItems || [],
                };
            }
            return state;

        case EReduxType.EMPLOYEE_DELETE:
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
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    isDeleting: false,
                    isFailure: true,
                    reload: false,
                };
            }
            return state;

        case EReduxType.EMPLOYEE_DETAIL:
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

        case EReduxType.EMPLOYEE_UPDATE:
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

        case EReduxType.EMPLOYEE_RESET_PASSWORD:
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
        default:
            return state;
    }
};
