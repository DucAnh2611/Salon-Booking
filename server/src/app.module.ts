import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { DatabaseModule } from './module/database/database.module';
import { RedisModule } from './module/redis/redis.module';

import { AppExceptionFilter } from './shared/exception';

import { AppLoggerModule } from './module/logger/logger.module';
import { AppLoggerService } from './module/logger/logger.service';
import { AppResponseInterceptor } from './shared/interceptor';

@Module({
  imports: [ConfigModule, RedisModule, DatabaseModule, AppLoggerModule, AuthModule],
  controllers: [],
  providers: [
    AppLoggerService,
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
    { provide: APP_INTERCEPTOR, useClass: AppResponseInterceptor },
  ],
})
export class AppModule {}
