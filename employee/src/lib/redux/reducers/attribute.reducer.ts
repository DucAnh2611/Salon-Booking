import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import {
    IActionDedicateAttribute,
    IInitialStateAttribute,
} from "@/interface/redux/attribute.interface";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";

const initialState: IInitialStateAttribute = {
    attrs: [],
    isDeleting: false,
    isUpdating: false,
    isCreating: false,
    reload: false,
    isCalling: false,
    isFailure: false,
    page: 0,
    limit: 0,
    count: 0,
    key: "",
    orderBy: "",
};

export const attributeReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateAttribute
): IInitialStateAttribute => {
    switch (action.type) {
        case EReduxType.ATTRIBUTE_LIST:
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
                    ...action,
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
        default:
            return state;
    }
};
