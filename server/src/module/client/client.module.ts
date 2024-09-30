import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtTokenUtil } from '../../shared/utils/token.utils';
import { MailModule } from '../mail/mail.module';
import { MediaModule } from '../media/media.module';
import { RedisModule } from '../redis/redis.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { ClientAdminController } from './controller/client-admin.controller';
import { ClientVerifyController } from './controller/client-verify.controller';
import { ClientController } from './controller/client.controller';
import { ClientEntity } from './entity/client.entity';
import { ClientAdminService } from './service/client-admin.service';
import { ClientService } from './service/client.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ClientEntity]),
        MailModule,
        MediaModule,
        UserModule,
        RedisModule,
        RoleModule,
        RolePermissionModule,
    ],
    controllers: [ClientController, ClientVerifyController, ClientAdminController],
    providers: [ClientService, ClientAdminService, JwtService, JwtTokenUtil],
    exports: [ClientService],
})
export class ClientModule {}
