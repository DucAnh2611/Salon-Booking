import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieModule } from '../../shared/global/cookie/cookie.module';
import { EmployeeEntity } from '../employee/entity/employee.entity';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtTokenUtil } from './utils/token.utils';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity]), JwtModule, CookieModule, UserModule, RoleModule],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenUtil],
})
export class AuthModule {}
