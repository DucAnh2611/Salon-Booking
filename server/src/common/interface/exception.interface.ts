import { HttpStatus } from '@nestjs/common';
import { TargetActionType } from '../../shared/decorator/permission.decorator';
import { DataErrorCodeEnum } from '../enum/data-error-code.enum';
import { RequestErrorCodeEnum } from '../enum/request-error-code.enum';

export interface AppReponseBase {
    status: HttpStatus;
}

export interface AppExceptionType extends AppReponseBase {
    message: string | AppDetailMessage | DataErrorCodeEnum | PermissionRequireMessage;
    requestCode: RequestErrorCodeEnum;
}

export interface AppDetailMessage {
    [key: string]: DataErrorCodeEnum[];
}

export interface PermissionRequireMessage {
    require: TargetActionType[];
    userPermission: TargetActionType[];
}

export interface AppExceptionResponseType extends AppReponseBase {
    message: string | AppDetailMessage | PermissionRequireMessage;
    code: RequestErrorCodeEnum;
}
