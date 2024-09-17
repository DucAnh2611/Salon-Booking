import { API } from "@/constant/api.constant";
import { EDataErrorCode } from "@/enum/data-code-error.enum";
import { ERequestErrorCode } from "@/enum/request-code-error.enum";
import {
    IApiResponse,
    IFailRequest,
    ISuccessRequest,
} from "@/interface/response.interface";
import axios, { AxiosError } from "axios";

const { api_base_url, api_prefix } = API;
export const api_media_url = `${api_base_url}${api_prefix}media/`;

type ApiCallProps = {
    endPoint: string;
    method: string;
    payload?: any;
    headers: Record<string, string>;
    params?: Record<string, unknown>;
    withCredentials?: boolean;
    log?: boolean;
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
        const result = await axios.request({
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

        let error: IFailRequest = (err.response?.data as IFailRequest) || {
            status: 400,
            code: "RE002",
            message: "DE001",
        };

        error = {
            ...error,
            code:
                getEnumValue(ERequestErrorCode, error.code) ||
                ERequestErrorCode.RE002,
            message:
                getEnumValue(EDataErrorCode, error.message) ||
                EDataErrorCode.DE001,
        };

        return {
            response: null,
            error,
        } as IApiResponse<T>;
    }
};
function getEnumValue(enumObject: any, fieldName: string): string | undefined {
    return enumObject[fieldName];
}
