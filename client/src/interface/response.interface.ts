export interface IApiResponse<T> {
    response: ISuccessRequest<T> | null;
    error: IFailRequest | null;
}

export interface IBaseRequest {
    status: number;
}

export interface IFailRequest extends IBaseRequest {
    code: string;
    message: string;
}

export interface ISuccessRequest<T> extends IBaseRequest {
    result: T;
}
