import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtTokenUtil } from '../../shared/utils/token.utils';
import { MailModule } from '../mail/mail.module';
import { RedisModule } from '../redis/redis.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { ClientService } from './client.service';
import { ClientVerifyController } from './controller/client-verify.controller';
import { ClientController } from './controller/client.controller';
import { ClientEntity } from './entity/client.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ClientEntity]), MailModule, UserModule, RedisModule, RoleModule],
    controllers: [ClientController, ClientVerifyController],
    providers: [ClientService, JwtService, JwtTokenUtil],
    exports: [ClientService],
})
export class ClientModule {}
