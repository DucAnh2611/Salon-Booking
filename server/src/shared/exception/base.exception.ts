import { HttpStatus } from '@nestjs/common';
import { RequestErrorCodeEnum } from '../../common/enum/request-error-code.enum';
import {
  AppDetailMessage,
  AppExceptionResponseType,
  AppExceptionType,
} from '../../common/interface/exception.interface';

export class AppExceptionBase {
  private message: string | AppDetailMessage;
  private requestCode: RequestErrorCodeEnum;
  private statusCode: HttpStatus;

  constructor({ message, status, requestCode }: AppExceptionType) {
    this.requestCode = requestCode;
    this.statusCode = status;
    this.message = message;
  }

  getStatus() {
    return this.statusCode;
  }

  getResponse(): AppExceptionResponseType {
    return {
      status: this.statusCode,
      code: this.requestCode,
      message: this.message,
    };
  }
}
