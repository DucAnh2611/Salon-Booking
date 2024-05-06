import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANT } from '../../../common/constant/jwt.constant';
import { RequestErrorCodeEnum } from '../../../common/enum/request-error-code.enum';
import { CookiePayloadType, JwtRefreshTokenPayloadType } from '../../../common/type/auth.type';
import { cookieConfig } from '../../../config/cookie.config';
import { Forbidden } from '../../../shared/exception/error.exception';
import { ExtractStrategy } from '../../../shared/utils/extract-strategy.utils';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, JWT_CONSTANT.refresh.strategyName) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractStrategy.extractFromCookies(cookieConfig.refreshtoken.name)]),
      secretOrKey: process.env.REFRESHTOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtRefreshTokenPayloadType) {
    const { refreshToken }: CookiePayloadType = JSON.parse(
      ExtractStrategy.extractFromCookies(cookieConfig.refreshtoken.name)(req),
    );

    if (!refreshToken) throw new Forbidden({ requestCode: RequestErrorCodeEnum.FORBIDDEN });
    return { ...payload, refreshToken };
  }
}
