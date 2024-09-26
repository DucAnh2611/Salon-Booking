import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANT } from '../../../common/constant/jwt.constant';
import { DataErrorCodeEnum } from '../../../common/enum/data-error-code.enum';
import { RequestErrorCodeEnum } from '../../../common/enum/request-error-code.enum';
import { AccessTokenPayload } from '../../../common/interface/auth.interface';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { cookieConfig } from '../../../config/cookie.config';
import { jwtConfig } from '../../../config/jwt.config';
import { Forbidden } from '../../../shared/exception/error.exception';
import { ExtractStrategy } from '../../../shared/utils/extract-strategy.utils';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, JWT_CONSTANT.access.strategyNameManager) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractStrategy.extractFromCookies(cookieConfig.accesstoken.manager),
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: jwtConfig.access.secret,
            passReqToCallback: true,
        });
    }

    validate(req: AppRequest, payload: AccessTokenPayload) {
        const accessToken: string = ExtractStrategy.extractFromCookies(cookieConfig.accesstoken.manager)(req);

        req.accessPayload = { ...payload };

        if (!accessToken)
            throw new Forbidden({
                requestCode: RequestErrorCodeEnum.FORBIDDEN,
                message: DataErrorCodeEnum.INVALID_ACCESS_TOKEN,
            });

        return { ...payload, accessToken };
    }
}

@Injectable()
export class AccessTokenClientStrategy extends PassportStrategy(Strategy, JWT_CONSTANT.access.strategyNameClient) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractStrategy.extractFromCookies(cookieConfig.accesstoken.client),
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: jwtConfig.access.secret,
            passReqToCallback: true,
        });
    }

    validate(req: AppRequest, payload: AccessTokenPayload) {
        const accessToken: string = ExtractStrategy.extractFromCookies(cookieConfig.accesstoken.client)(req);

        req.accessPayload = { ...payload };

        if (!accessToken)
            throw new Forbidden({
                requestCode: RequestErrorCodeEnum.FORBIDDEN,
                message: DataErrorCodeEnum.INVALID_ACCESS_TOKEN,
            });

        return { ...payload, accessToken };
    }
}
