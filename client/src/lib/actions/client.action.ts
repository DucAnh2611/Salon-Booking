import { API_URLS } from "@/constant/api.constant";
import {
    IClientInfo,
    IVerifyEmailResponse,
} from "@/interface/client.interface";
import { apiCall } from "../apiCall";

/** @GET_INFO */
export const getInfo = async () => {
    const api = API_URLS.CLIENT.INFO();

    const resApi = await apiCall<IClientInfo>({ ...api });

    return resApi;
};

/** @UPDATE_INFO */
export const updateClientInfo = async (body: FormData) => {
    const api = API_URLS.CLIENT.UPDATE();

    const resApi = await apiCall<IClientInfo>({ ...api, payload: body });

    return resApi;
};

/** @VERIFY_EMAIL */
export const sendEmailverify = async () => {
    const api = API_URLS.CLIENT.VERIFY_EMAIL();

    const resApi = await apiCall<IVerifyEmailResponse>({ ...api });

    return resApi;
};

/** @VERIFY_EMAIL_OTP */
export const verifyOtp = async (otp: string) => {
    const api = API_URLS.CLIENT.VERIFY_EMAIL_OTP();

    const resApi = await apiCall({ ...api, payload: { otp } });

    return resApi;
};
