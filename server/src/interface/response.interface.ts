import { DataErrorCodeEnum } from '../enum/data-error-code.enum';
import { RequestErrorCodeEnum } from '../enum/request-error-code.enum';

export type ResponseMessageFailType = { [key: string]: DataErrorCodeEnum };
export type ResponseStatusType = number;
export type ResponseMessageType = number | ResponseMessageFailType;

export type AppResponseBaseType = {
    status: ResponseStatusType;
    message: string;
};

export type AppResponseSuccessType = AppResponseBaseType & {
    result: Array<object> | object;
};

export type AppReponseFailType = AppResponseBaseType & {
    code: RequestErrorCodeEnum;
};
