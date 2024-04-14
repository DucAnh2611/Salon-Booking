import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANT } from '../../../common/constant/jwt.constant';
import { RequestErrorCodeEnum } from '../../../common/enum/request-error-code.enum';
import { cookieConfig } from '../../../config/cookie.config';
import { Forbidden } from '../../../shared/exception/error.exception';

@Injectable()
export class RefreshTokenStragy extends PassportStrategy(Strategy, JWT_CONSTANT.refresh.strategyName) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([RefreshTokenStragy.extractFromCookies]),
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken: string = RefreshTokenStragy.extractFromCookies(req);
    if (!refreshToken) throw new Forbidden({ response: RequestErrorCodeEnum.FORBIDDEN });
    return { ...payload, refreshToken };
  }

  static extractFromCookies(req: Request): string | null {
    return req.cookies[cookieConfig.name] || null;
  }
}
