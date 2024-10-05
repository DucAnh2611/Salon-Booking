import { toast } from "@/components/ui/use-toast";
import { API_URLS } from "@/constants/api.constant";
import {
    DATA_ERROR_CODE,
    REQUEST_ERROR_CODE,
} from "@/constants/error.constant";
import { TOKEN } from "@/constants/token.constant";
import { EDataErrorCode } from "@/enum/data-code-error.enum";
import { ERequestErrorCode } from "@/enum/request-code-error.enum";
import {
    IApiResponse,
    IFailRequest,
    ISuccessRequest,
} from "@/interface/api/response.interface";
import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";

const axiosInstant = axios.create();

axiosRetry(axiosInstant, { retries: 3 });

export const api_base_url = process.env.REACT_APP_BACKEND_HOST || "";
const api_prefix = process.env.REACT_APP_BACKEND_PREFIX || "";
export const api_media_url = `${api_base_url}${api_prefix}media/`;

type ApiCallProps = {
    endPoint: string;
    method: string;
    payload?: any;
    headers: Record<string, string>;
    params?: Record<string, unknown>;
    withCredentials?: boolean;
    tryRefresh?: boolean;
};

const parseParams = (params: Record<string, unknown>) => {
    const keys = Object.keys(params);
    let options = "";

    keys.forEach((key) => {
        const isParamTypeObject = typeof params[key] === "object";

        if (
            !isParamTypeObject &&
            typeof params[key] !== "undefined" &&
            params[key] !== ""
        ) {
            options += `${key}=${params[key]}&`;
        }
    });

    return options ? options.slice(0, -1) : options;
};

export const apiCall = async <T>({
    endPoint,
    method,
    payload,
    headers,
    params,
    withCredentials = false,
}: ApiCallProps) => {
    try {
        const result = await axiosInstant.request({
            method,
            url: endPoint,
            headers,
            data: payload,
            params,
            paramsSerializer: (params) => parseParams(params),
            withCredentials,
            baseURL: api_base_url + api_prefix,
        });

        return {
            response: result.data as ISuccessRequest<T>,
            error: null,
        } as IApiResponse<T>;
    } catch (e) {
        const err = e as AxiosError;

        const errorApi = (err.response?.data as IFailRequest) || null;

        const error: IFailRequest = errorApi || {
            status: 400,
            code: ERequestErrorCode.SERVER_INTERNAL,
            message: EDataErrorCode.INTERNAL,
        };

        if (errorApi.code === ERequestErrorCode.FORBIDDEN) {
            if (errorApi.message === EDataErrorCode.INVALID_ACCESS_TOKEN) {
                const { response: rfRes } = await refreshToken();
                if (rfRes) {
                    const recall: IApiResponse<T> = await apiCall<T>({
                        endPoint,
                        method,
                        payload,
                        headers,
                        params,
                        withCredentials,
                    });
                    return recall;
                }
            }
            if (errorApi.message === EDataErrorCode.INVALID_REFRESH_TOKEN) {
                localStorage.removeItem(TOKEN.LCS);

                toast({
                    variant: "destructive",
                    title: "Lỗi xác thực",
                    description:
                        "Thông tin xác thực không hợp lệ vui lòng đặng nhập lại.",
                    duration: 1000,
                });
            }
        } else {
            toast({
                variant: "destructive",
                title: REQUEST_ERROR_CODE[error.code],
                description:
                    DATA_ERROR_CODE[error.message] || DATA_ERROR_CODE.DE999,
                duration: 1000,
            });
        }

        return {
            response: null,
            error,
        } as IApiResponse<T>;
    }
};

async function refreshToken() {
    const api = API_URLS.AUTH.REFRESH_TOKEN();
    return apiCall({ ...api });
}
