import { HttpStatus } from '@nestjs/common';
import { RequestErrorCodeEnum } from '../../common/enum/request-error-code.enum';
import { AppExceptionType } from '../../common/interface/exception.interface';
import { AppExceptionBase } from './base.exception';

export class ServerInternal extends AppExceptionBase {
  constructor() {
    super({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      requestCode: RequestErrorCodeEnum.SERVER_INTERNAL,
      message: 'Internal in server',
    });
  }
}

export class Forbidden extends AppExceptionBase {
  constructor({ message }: Partial<AppExceptionType>) {
    super({ status: HttpStatus.FORBIDDEN, requestCode: RequestErrorCodeEnum.FORBIDDEN, message: message });
  }
}

export class BadRequest extends AppExceptionBase {
  constructor({ message }: Partial<AppExceptionType>) {
    super({ status: HttpStatus.BAD_REQUEST, requestCode: RequestErrorCodeEnum.BAD_REQUEST, message: message });
  }
}

export class InternalServer extends AppExceptionBase {
  constructor({ message }: Partial<AppExceptionType>) {
    super({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      requestCode: RequestErrorCodeEnum.INTERNAL_SERVER_ERROR,
      message: message,
    });
  }
}
