import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANT } from '../../../common/constant/jwt.constant';
import { RequestErrorCodeEnum } from '../../../common/enum/request-error-code.enum';
import { RefreshTokenPayload } from '../../../common/interface/auth.interface';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { cookieConfig } from '../../../config/cookie.config';
import { jwtConfig } from '../../../config/jwt.config';
import { Forbidden } from '../../../shared/exception/error.exception';
import { ExtractStrategy } from '../../../shared/utils/extract-strategy.utils';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, JWT_CONSTANT.refresh.strategyName) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractStrategy.extractFromCookies(cookieConfig.refreshtoken.name),
            ]),
            secretOrKey: jwtConfig.refresh.secret,
            passReqToCallback: true,
        });
    }

    validate(req: AppRequest, payload: RefreshTokenPayload) {
        const refreshToken: string = ExtractStrategy.extractFromCookies(cookieConfig.refreshtoken.name)(req);

        req.refreshPayload = { ...payload };

        if (!refreshToken) throw new Forbidden({ requestCode: RequestErrorCodeEnum.FORBIDDEN });
        return { ...payload, refreshToken };
    }
}
