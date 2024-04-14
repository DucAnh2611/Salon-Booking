import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashPasswordUtil } from './utils/hash-password.utils';
import { JwtTokenUtil } from './utils/token.utils';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenUtil, HashPasswordUtil],
})
export class AuthModule {}
