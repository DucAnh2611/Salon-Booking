import { EReduxType } from "@/enum/type-redux.enum";
import { isSuccessfulApiCall } from "@/helpers/actionDedecate";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";
import {
    IActionDedicateTheme,
    IInitialStateTheme,
} from "@/interface/redux/theme.interface";

const initialState: IInitialStateTheme = {
    theme: null,
};

export const themeReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateTheme
): IInitialStateTheme => {
    switch (action.type) {
        case EReduxType.THEME_SWITCH:
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    theme: action.theme,
                };
            }
            return state;
        default:
            return state;
    }
};
