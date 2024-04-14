import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { AppLoggerService } from '../../module/logger/logger.service';

@Injectable()
export class AppResponseInterceptor implements NestInterceptor {
  private readonly logger: AppLoggerService = new AppLoggerService('Response');

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const start = Date.now();

    return next.handle().pipe(
      map(data => {
        this.logger.info({ status: 200, result: data });
        return { status: 200, result: data };
      }),
      tap(() => console.log(`After... ${Date.now() - start}ms`)),
    );
  }
}
