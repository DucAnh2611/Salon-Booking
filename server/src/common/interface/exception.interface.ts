import { HttpStatus } from '@nestjs/common';
import { DataErrorCodeEnum } from '../enum/data-error-code.enum';
import { RequestErrorCodeEnum } from '../enum/request-error-code.enum';

export interface AppExceptionType {
  message: string | AppDetailMessage;
  status: HttpStatus;
  requestCode: RequestErrorCodeEnum;
}

export interface AppDetailMessage {
  [key: string]: DataErrorCodeEnum[];
}

export interface AppExceptionResponseType {
  message: string | AppDetailMessage;
  status: HttpStatus;
  code: RequestErrorCodeEnum;
}
