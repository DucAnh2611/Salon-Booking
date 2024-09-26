import { API_URLS } from "@/constant/api.constant";
import {
    IApiLogin,
    IApiLoginResponse,
    IApiSignup,
    IAPIUserClientMe,
} from "@/interface/user.interface";
import { apiCall } from "../apiCall";

/** @ME */
export const meApi = async () => {
    const api = API_URLS.AUTH.ME();

    const apiRes = await apiCall<IAPIUserClientMe>({ ...api });

    return apiRes;
};

/** @LOGIN */
export const loginApi = async (body: IApiLogin) => {
    const api = API_URLS.AUTH.LOGIN();

    const apiRes = await apiCall<IApiLoginResponse>({ ...api, payload: body });

    return apiRes;
};

/** @SIGNUP */
export const signupApi = async (body: IApiSignup) => {
    const api = API_URLS.AUTH.REGISTER();

    const apiRes = await apiCall({ ...api, payload: body });

    return apiRes;
};
