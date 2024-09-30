import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import {
    IActionDedicateStatisticDashboard,
    IInitialStateStatisticDashboard,
} from "@/interface/redux/dashboard.interface";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";

const initialState: IInitialStateStatisticDashboard = {
    statistic: null,
    year: 0,
    month: 0,
    isCalling: false,
    isFailure: false,
};

export const dashboardReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateStatisticDashboard
): IInitialStateStatisticDashboard => {
    const { type, state: actionState, ...props } = action;
    switch (action.type) {
        case EReduxType.STATISTIC_DASHBOARD:
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
