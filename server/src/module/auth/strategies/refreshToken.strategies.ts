import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { cookieConfig } from '../../../config/cookie.config';
import { jwtConfig } from '../../../config/jwt.config';
import { JWT_CONSTANT } from '../../../constant/jwt.constant';
import { DataErrorCodeEnum } from '../../../enum/data-error-code.enum';
import { RequestErrorCodeEnum } from '../../../enum/request-error-code.enum';
import { Forbidden } from '../../../exception/error.exception';
import { RefreshTokenPayload } from '../../../interface/auth.interface';
import { AppRequest } from '../../../interface/custom-request.interface';
import { ExtractStrategy } from '../../../utils/extract-strategy.utils';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, JWT_CONSTANT.refresh.strategyNameManager) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractStrategy.extractFromCookies(cookieConfig.refreshtoken.manager),
            ]),
            secretOrKey: jwtConfig.refresh.secret,
            passReqToCallback: true,
        });
    }

    validate(req: AppRequest, payload: RefreshTokenPayload) {
        const refreshToken: string = ExtractStrategy.extractFromCookies(cookieConfig.refreshtoken.manager)(req);

        req.refreshPayload = { ...payload };

        if (!refreshToken)
            throw new Forbidden({
                requestCode: RequestErrorCodeEnum.FORBIDDEN,
                message: DataErrorCodeEnum.INVALID_REFRESH_TOKEN,
            });
        return { ...payload, refreshToken };
    }
}

@Injectable()
export class RefreshTokenClientStrategy extends PassportStrategy(Strategy, JWT_CONSTANT.refresh.strategyNameClient) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractStrategy.extractFromCookies(cookieConfig.refreshtoken.client),
            ]),
            secretOrKey: jwtConfig.refresh.secret,
            passReqToCallback: true,
        });
    }

    validate(req: AppRequest, payload: RefreshTokenPayload) {
        const refreshToken: string = ExtractStrategy.extractFromCookies(cookieConfig.refreshtoken.client)(req);

        req.refreshPayload = { ...payload };

        if (!refreshToken)
            throw new Forbidden({
                requestCode: RequestErrorCodeEnum.FORBIDDEN,
                message: DataErrorCodeEnum.INVALID_REFRESH_TOKEN,
            });
        return { ...payload, refreshToken };
    }
}
