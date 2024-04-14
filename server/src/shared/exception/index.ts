import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { RequestErrorCodeEnum } from '../../common/enum/request-error-code.enum';
import { AppExceptionResponseType } from '../../common/interface/exception.interface';
import { AppLoggerService } from '../../module/logger/logger.service';
import { AppExceptionBase } from './base.exception';

@Catch()
export class AppExceptionFilter extends BaseExceptionFilter {
  private readonly logger: AppLoggerService = new AppLoggerService('Exception Filter');

  catch(exception: any, host: ArgumentsHost): void {
    const contextException = host.switchToHttp();
    const responseException: Response = contextException.getResponse();

    const caughtExeption: HttpException | AppExceptionBase = exception;

    let response: string | object | AppExceptionResponseType;
    const status = caughtExeption.getStatus();

    if (caughtExeption instanceof HttpException) {
      const rawException = caughtExeption.getResponse();
      const typeError = Object.entries(HttpStatus).find(item => item[1] === status)[0];

      response = {
        status: status,
        code: RequestErrorCodeEnum[typeError] || RequestErrorCodeEnum.BAD_REQUEST,
        message: rawException,
      };
    }
    if (caughtExeption instanceof AppExceptionBase) {
      response = caughtExeption.getResponse();
    }

    this.logger.error(response);

    responseException.status(200).send(response);
  }
}
