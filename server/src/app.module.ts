import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { DatabaseModule } from './module/database/database.module';
import { RedisModule } from './module/redis/redis.module';

import { AppExceptionFilter } from './shared/exception';

import { I18nAppModule } from './module/i18n/i18n.module';
import { AppLoggerModule } from './module/logger/logger.module';
import { AppLoggerService } from './module/logger/logger.service';
import { PermissionModule } from './module/permission/permission.module';
import { RolePermissionModule } from './module/role-permission/role-permission.module';
import { RoleModule } from './module/role/role.module';
import { AppResponseInterceptor } from './shared/interceptor';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        I18nAppModule,

        RedisModule,
        DatabaseModule,

        AppLoggerModule,

        AuthModule,
        RoleModule,
        RolePermissionModule,
        PermissionModule,
    ],
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
