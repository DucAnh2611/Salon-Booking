import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { DatabaseModule } from './module/database/database.module';
import { RedisModule } from './module/redis/redis.module';

import { AppExceptionFilter } from './shared/exception';

import { AttributeModule } from './module/attribute/attribute.module';
import { CategoryModule } from './module/category/category.module';
import { ClassificationEntity } from './module/classification/entity/classification.entity';
import { ClientVoucherModule } from './module/client-voucher/client-voucher.module';
import { EmployeeModule } from './module/employee/employee.module';
import { I18nAppModule } from './module/i18n/i18n.module';
import { AppLoggerModule } from './module/logger/logger.module';
import { AppLoggerService } from './module/logger/logger.service';
import { MediaModule } from './module/media/media.module';
import { PermissionModule } from './module/permission/permission.module';
import { ProductModule } from './module/product/product.module';
import { RolePermissionModule } from './module/role-permission/role-permission.module';
import { RoleModule } from './module/role/role.module';
import { ServiceModule } from './module/service/service.module';
import { VoucherClassificationEntity } from './module/voucher-classification/entity/voucher-classification.entity';
import { VoucherModule } from './module/voucher/voucher.module';
import { AppResponseInterceptor } from './shared/interceptor';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        I18nAppModule,

        RedisModule,
        DatabaseModule,

        AppLoggerModule,

        MediaModule,

        AuthModule,
        RoleModule,
        RolePermissionModule,
        PermissionModule,
        EmployeeModule,

        AttributeModule,
        CategoryModule,
        VoucherModule,
        ClassificationEntity,

        VoucherClassificationEntity,
        ClientVoucherModule,

        ProductModule,
        ServiceModule,
    ],
    controllers: [],
    providers: [
        AppLoggerService,
        {
            provide: APP_FILTER,
            useClass: AppExceptionFilter,
        },
        { provide: APP_INTERCEPTOR, useClass: AppResponseInterceptor },
        { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    ],
})
export class AppModule {}
