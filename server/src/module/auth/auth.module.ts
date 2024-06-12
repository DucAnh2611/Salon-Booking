import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieModule } from '../../shared/global/cookie/cookie.module';
import { JwtTokenUtil } from '../../shared/utils/token.utils';
import { ClientModule } from '../client/client.module';
import { EmployeeEntity } from '../employee/entity/employee.entity';
import { MailModule } from '../mail/mail.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategies';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategies';

@Module({
    imports: [
        TypeOrmModule.forFeature([EmployeeEntity]),
        MailModule,
        JwtModule,
        CookieModule,
        UserModule,
        ClientModule,
        RoleModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtTokenUtil, JwtService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
