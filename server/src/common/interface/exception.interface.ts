import { HttpStatus } from '@nestjs/common';
import { DataErrorCodeEnum } from '../enum/data-error-code.enum';
import { RequestErrorCodeEnum } from '../enum/request-error-code.enum';

export interface AppReponseBase {
  status: HttpStatus;
}

export interface AppExceptionType extends AppReponseBase {
  message: string | AppDetailMessage;
  requestCode: RequestErrorCodeEnum;
}

export interface AppDetailMessage {
  [key: string]: DataErrorCodeEnum[];
}

export interface AppExceptionResponseType extends AppReponseBase {
  message: string | AppDetailMessage;
  code: RequestErrorCodeEnum;
}
