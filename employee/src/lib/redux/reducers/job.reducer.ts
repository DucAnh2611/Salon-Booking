import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";
import {
    IActionDedicateJob,
    IInitialStateJob,
} from "@/interface/redux/job.interface";

const initialState: IInitialStateJob = {
    jobs: [],
    reload: true,
    isCalling: false,
    isFailure: false,
    page: 0,
    limit: 0,
    count: 0,
};

export const jobReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateJob
): IInitialStateJob => {
    const { state: actionState, type, ...props } = action;
    switch (type) {
        case EReduxType.MY_JOB:
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

        default:
            return state;
    }
};
