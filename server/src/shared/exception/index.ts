import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { LOGGER_CONSTANT_NAME } from '../../common/constant/logger.constant';
import { RequestErrorCodeEnum } from '../../common/enum/request-error-code.enum';
import { AppExceptionResponseType } from '../../common/interface/exception.interface';
import { AppLoggerService } from '../../module/logger/logger.service';
import { AppExceptionBase } from './base.exception';

@Catch()
export class AppExceptionFilter extends BaseExceptionFilter {
  private readonly logger: AppLoggerService = new AppLoggerService(LOGGER_CONSTANT_NAME.exception, 'Exception Filter');

  catch(exception: any, host: ArgumentsHost): void {
    const contextException = host.switchToHttp();
    const request: Request = contextException.getRequest();
    const responseException: Response = contextException.getResponse();

    const caughtExeption: HttpException | AppExceptionBase | RangeError = exception;

    let response: string | object | AppExceptionResponseType;
    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    console.log(caughtExeption);

    if (caughtExeption instanceof RangeError) {
      response = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        code: RequestErrorCodeEnum.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      };
    } else if (caughtExeption instanceof HttpException) {
      const rawException = caughtExeption.getResponse();
      status = caughtExeption.getStatus();
      const typeError = Object.entries(HttpStatus).find(item => item[1] === status)[0];

      response = {
        status: status,
        code: RequestErrorCodeEnum[typeError] || RequestErrorCodeEnum.BAD_REQUEST,
        message: rawException,
      };
    } else if (caughtExeption instanceof AppExceptionBase) {
      response = caughtExeption.getResponse();
      status = caughtExeption.getStatus();
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      response = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        code: RequestErrorCodeEnum.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      };
    }

    this.logger.error({
      request: {
        body: request.body,
        method: request.method,
        url: request.originalUrl,
        query: request.query,
        param: request.params,
      },
      error: response,
    });

    responseException.status(status).send(response);
  }
}
