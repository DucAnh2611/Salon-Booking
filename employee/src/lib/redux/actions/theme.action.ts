import { ETheme } from "@/enum/theme.enum";
import { EReduxType } from "@/enum/type-redux.enum";
import { isDispatchSuccess } from "@/helpers/dispatchDedicate";
import { TAppDispatch } from "../store";

/** @THEME_SWITCH */
const themeSwitchType = EReduxType.THEME_SWITCH;
export const themeSwitchApi =
    (theme: ETheme) => async (dispatch: TAppDispatch) => {
        dispatch(isDispatchSuccess(themeSwitchType, { theme }));

        localStorage.setItem("salon_booking_admin_theme", theme);
    };
