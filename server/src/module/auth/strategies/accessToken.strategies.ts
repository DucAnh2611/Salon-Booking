import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { cookieConfig } from '../../../config/cookie.config';
import { jwtConfig } from '../../../config/jwt.config';
import { JWT_CONSTANT } from '../../../constant/jwt.constant';
import { DataErrorCodeEnum } from '../../../enum/data-error-code.enum';
import { RequestErrorCodeEnum } from '../../../enum/request-error-code.enum';
import { Forbidden } from '../../../exception/error.exception';
import { AccessTokenPayload } from '../../../interface/auth.interface';
import { AppRequest } from '../../../interface/custom-request.interface';
import { ExtractStrategy } from '../../../utils/extract-strategy.utils';

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
