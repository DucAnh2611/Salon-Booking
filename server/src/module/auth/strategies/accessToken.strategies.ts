import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANT } from '../../../common/constant/jwt.constant';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, JWT_CONSTANT.refresh.strategyName) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_ACCESS_TOKEN,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
