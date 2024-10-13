import { API_URLS } from "@/constant/api.constant";
import {
    IApiResetPassword,
    ICheckEmailResetpassword,
    IClient,
    IClientInfo,
    ISendEmailResetpassword,
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

/** @CHECK_EXIST_EMAIL */
export const existEmail = async (email: string) => {
    const api = API_URLS.CLIENT.EXIST(email);

    const resApi = await apiCall<IClient | null>({ ...api });

    return resApi;
};

/** @SEND_SIGNATURE_RESET_PASSWORD */
export const sendSignatureResetPassword = async (email: string) => {
    const api = API_URLS.CLIENT.SEND_RESET_PASSWORD_EMAIL(email);

    const resApi = await apiCall<ISendEmailResetpassword>({ ...api });

    return resApi;
};

/** @CHECK_RESET_PASSWORD_SIGNATURE */
export const checkSignatureResetPassword = async (
    email: string,
    token: string
) => {
    const api = API_URLS.CLIENT.CHECK_RESET_PASSWORD_SIGNATURE(email, token);

    const resApi = await apiCall<ICheckEmailResetpassword>({ ...api });

    return resApi;
};

/** @RESET_PASSWORD */
export const resetPassword = async (body: IApiResetPassword) => {
    const api = API_URLS.CLIENT.RESET_PASSWORD();

    const resApi = await apiCall<ISendEmailResetpassword>({
        ...api,
        payload: body,
    });

    return resApi;
};
