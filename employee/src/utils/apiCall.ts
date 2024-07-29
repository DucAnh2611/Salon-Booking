import { toast } from "@/components/ui/use-toast";
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

const api_base_url = process.env.REACT_APP_BACKEND_HOST || "";
const api_prefix = process.env.REACT_APP_BACKEND_PREFIX || "";
export const api_media_url = `${api_base_url}${api_prefix}media/`;

type ApiCallProps = {
    endPoint: string;
    method: string;
    payload?: any;
    headers: Record<string, string>;
    params?: Record<string, unknown>;
    withCredentials?: boolean;
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

        const error: IFailRequest = (err.response?.data as IFailRequest) || {
            status: 400,
            code: ERequestErrorCode.RE002,
            message: EDataErrorCode.DE001,
        };

        toast({
            variant: "destructive",
            title:
                getEnumValue(ERequestErrorCode, error.code) ||
                ERequestErrorCode.RE002,
            description:
                getEnumValue(EDataErrorCode, error.message) ||
                EDataErrorCode.DE999,
        });

        return {
            response: null,
            error,
        } as IApiResponse<T>;
    }
};
function getEnumValue(enumObject: any, fieldName: string): string | undefined {
    return enumObject[fieldName];
}
