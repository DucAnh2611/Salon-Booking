import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieModule } from '../../shared/global/cookie/cookie.module';
import { EmployeeEntity } from '../employee/entity/employee.entity';
import { MailModule } from '../mail/mail.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategies';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategies';
import { JwtTokenUtil } from './utils/token.utils';

@Module({
    imports: [TypeOrmModule.forFeature([EmployeeEntity]), MailModule, JwtModule, CookieModule, UserModule, RoleModule],
    controllers: [AuthController],
    providers: [AuthService, JwtTokenUtil, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
