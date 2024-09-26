import { EDataErrorCode } from "@/enum/data-code-error.enum";
import { ERequestErrorCode } from "@/enum/request-code-error.enum";

export interface IApiResponse<T> {
    response: ISuccessRequest<T> | null;
    error: IFailRequest | null;
}

export interface IBaseRequest {
    status: number;
}

export interface IFailRequest extends IBaseRequest {
    code: ERequestErrorCode;
    message: EDataErrorCode;
}

export interface ISuccessRequest<T> extends IBaseRequest {
    result: T;
}
