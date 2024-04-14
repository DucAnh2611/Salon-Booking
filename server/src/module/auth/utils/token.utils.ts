import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AccessTokenPayload, RefreshTokenPayload } from '../../../common/interface/auth.interface';

@Injectable()
export class JwtTokenUtil {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: AccessTokenPayload | RefreshTokenPayload, key: string, options: JwtSignOptions) {
    return this.jwtService.signAsync(payload, {
      secret: key,
      ...options,
    });
  }
}
