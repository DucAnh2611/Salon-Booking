import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { DatabaseModule } from './module/database/database.module';

import { AppExceptionFilter } from './shared/exception';

import { ScheduleModule as CronModule } from '@nestjs/schedule';
import { AttributeModule } from './module/attribute/attribute.module';
import { CartModule } from './module/cart/cart.module';
import { CategoryModule } from './module/category/category.module';
import { ClientModule } from './module/client/client.module';
import { EmployeeModule } from './module/employee/employee.module';
import { I18nAppModule } from './module/i18n/i18n.module';
import { AppLoggerModule } from './module/logger/logger.module';
import { AppLoggerService } from './module/logger/logger.service';
import { MailModule } from './module/mail/mail.module';
import { MailerAppModule } from './module/mailer/mailer.module';
import { MediaModule } from './module/media/media.module';
import { OrderModule } from './module/order/order.module';
import { OrganizationModule } from './module/organization/organization.module';
import { PermissionModule } from './module/permission/permission.module';
import { ProductModule } from './module/product/product.module';
import { RedisModule } from './module/redis/redis.module';
import { RolePermissionModule } from './module/role-permission/role-permission.module';
import { RoleModule } from './module/role/role.module';
import { ScheduleModule } from './module/schedule/schedule.module';
import { ServiceModule } from './module/service/service.module';
import { SettingModule } from './module/setting/setting.module';
import { SocketModule } from './module/socket/socket.module';
import { StatisticModule } from './module/statistic/statistic.module';
import { ThirdPartyModule } from './module/thirdparty/thirdparty.module';
import { WebhookModule } from './module/webhook/webhook.module';
import { AppResponseInterceptor } from './shared/interceptor';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CronModule.forRoot(),
        I18nAppModule,
        AppLoggerModule,

        RedisModule,
        MailerAppModule,
        DatabaseModule,
        SocketModule,

        MediaModule,

        MailModule,
        ClientModule,
        AuthModule,
        RoleModule,
        RolePermissionModule,
        PermissionModule,
        EmployeeModule,

        AttributeModule,
        CategoryModule,

        ProductModule,
        ServiceModule,
        ScheduleModule,

        CartModule,
        OrderModule,

        StatisticModule,
        OrganizationModule,
        SettingModule,
        WebhookModule,

        //Third party module
        ThirdPartyModule,
    ],
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
