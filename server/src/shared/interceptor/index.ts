import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, Observable } from 'rxjs';
import { LOGGER_CONSTANT_NAME } from '../../common/constant/logger.constant';
import { AppLoggerService } from '../../module/logger/logger.service';
import { InternalServer } from '../exception/error.exception';
import { AppBaseResponse } from './base.response';

@Injectable()
export class AppResponseInterceptor implements NestInterceptor {
  private readonly loggerRequest: AppLoggerService = new AppLoggerService(LOGGER_CONSTANT_NAME.request, 'Request');
  private readonly loggerResponse: AppLoggerService = new AppLoggerService(LOGGER_CONSTANT_NAME.response, 'Response');

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const start = Date.now();
    this.loggerRequest.info({
      body: request.body,
      method: request.method,
      url: request.originalUrl,
      query: request.query,
      param: request.params,
    });

    return next.handle().pipe(
      map(data => {
        const response: Response = context.switchToHttp().getResponse();
        let status: HttpStatus = HttpStatus.OK;
        let result: object | object[] = data;

        if (data instanceof AppBaseResponse) {
          status = data.getStatus();
          result = data.getResult();
        }

        this.loggerResponse.info({
          request: {
            body: request.body,
            method: request.method,
            url: request.originalUrl,
            query: request.query,
            param: request.params,
          },
          response: {
            status: status,
            duration: `${Date.now() - start}ms`,
            data,
          },
        });

        response.status(status);
        return { status, result };
      }),
      catchError(() => {
        throw new InternalServer({ message: 'Internal Server Error' });
      }),
    );
  }
}
