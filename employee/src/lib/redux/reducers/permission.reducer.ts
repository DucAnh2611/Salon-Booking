import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";
import {
    IActionDedicatePermission,
    IInitialStatePermission,
} from "@/interface/redux/permission.interface";

const initialState: IInitialStatePermission = {
    isCalling: false,
    isFailure: false,
    permissions: [],
};

export const permissionReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicatePermission
): IInitialStatePermission => {
    switch (action.type) {
        case EReduxType.PERMISSION_LIST:
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
                    permissions: action.permissions || state.permissions,
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
        default:
            return state;
    }
};
