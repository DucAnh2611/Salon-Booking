import { API_URLS } from "@/constants/api.constant";
import { TOKEN } from "@/constants/token.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import { ILoginPayload } from "@/interface/api/auth.interface";
import { IEmployee } from "@/interface/api/employee.interface";
import { IActionDedicateAuth } from "@/interface/redux/auth.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @LOGIN  */
const authDispatchType: EReduxType = EReduxType.AUTH_LOGIN;
export const LoginApi =
    (payload: ILoginPayload) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.AUTH.LOGIN();

        dispatch(
            isDispatchCalling<IActionDedicateAuth>(authDispatchType, {
                loginPayload: payload,
            })
        );

        const { response, error } = await apiCall<{ accessToken: string }>({
            ...api,
            payload,
        });

        if (response) {
            dispatch(isDispatchSuccess(authDispatchType));
            if (response.result.accessToken)
                localStorage.setItem(TOKEN.LCS, response.result.accessToken);
        } else {
            dispatch(isDispatchFailed(authDispatchType));
        }
    };

/** @AUTH_TOKEN  */
const authTokenType: EReduxType = EReduxType.AUTH_TOKEN;
export const authTokenAction = () => async (dispatch: TAppDispatch) => {
    dispatch(isDispatchCalling(authTokenType));

    const token = localStorage.getItem(TOKEN.LCS);

    if (token) {
        dispatch(isDispatchSuccess(authTokenType));
    } else {
        dispatch(isDispatchFailed(authTokenType));
    }
};

/** @ME  */
const meDispatchType: EReduxType = EReduxType.ME;
export const meApi = () => async (dispatch: TAppDispatch) => {
    const api = API_URLS.AUTH.ME();

    dispatch(isDispatchCalling<IActionDedicateAuth>(meDispatchType));

    const { response, error } = await apiCall<IEmployee>({
        ...api,
    });

    if (response) {
        dispatch(
            isDispatchSuccess<IActionDedicateAuth>(meDispatchType, {
                user: response.result,
            })
        );
    } else {
        dispatch(isDispatchFailed<IActionDedicateAuth>(meDispatchType));
    }
};

/** @AUTH_LOGOUT */
const logoutType: EReduxType = EReduxType.AUTH_LOGOUT;
export const logoutApi = () => async (dispatch: TAppDispatch) => {
    const api = API_URLS.AUTH.LOGOUT();

    dispatch(isDispatchCalling(logoutType));

    const { response, error } = await apiCall<string>({
        ...api,
    });

    if (response) {
        dispatch(isDispatchSuccess(logoutType));
        localStorage.removeItem(TOKEN.LCS);
    } else {
        dispatch(isDispatchFailed(logoutType));
    }
};
