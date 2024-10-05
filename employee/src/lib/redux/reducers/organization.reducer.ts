import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";
import {
    IActionDedicateOrganization,
    IInitialStateOrganization,
} from "@/interface/redux/organization.interface";

const initialState: IInitialStateOrganization = {
    items: [],
    isDeleting: false,
    isUpdating: false,
    isCreating: false,
    reload: false,
    isCalling: false,
    isFailure: false,
    page: 1,
    limit: 10,
    count: 0,
    detail: null,
    current: null,
};

export const organizationReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateOrganization
): IInitialStateOrganization => {
    const { type, state: actionState, ...props } = action;

    switch (type) {
        case EReduxType.ORGANIZATION_LIST:
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
                    reload: false,
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

        case EReduxType.ORGANIZATION_CREATE:
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
                    ...props,
                    reload: true,
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

        case EReduxType.ORGANIZATION_UPDATE:
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

        case EReduxType.ORGANIZATION_DELETE:
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
                    ...props,
                    reload: true,
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

        case EReduxType.ORGANIZATION_DETAIL:
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

        case EReduxType.ORGANIZATION_CURRENT:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    ...props,
                    isFailure: false,
                };
            }

            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    isFailure: true,
                };
            }

            return state;

        default:
            return state;
    }
};
