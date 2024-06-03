import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANT } from '../../../common/constant/jwt.constant';
import { RequestErrorCodeEnum } from '../../../common/enum/request-error-code.enum';
import { AccessTokenPayload } from '../../../common/interface/auth.interface';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { cookieConfig } from '../../../config/cookie.config';
import { jwtConfig } from '../../../config/jwt.config';
import { Forbidden } from '../../../shared/exception/error.exception';
import { ExtractStrategy } from '../../../shared/utils/extract-strategy.utils';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, JWT_CONSTANT.access.strategyName) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractStrategy.extractFromCookies(cookieConfig.accesstoken.name),
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: jwtConfig.access.secret,
            passReqToCallback: true,
        });
    }

    validate(req: AppRequest, payload: AccessTokenPayload) {
        const accessToken: string = ExtractStrategy.extractFromCookies(cookieConfig.accesstoken.name)(req);

        req.accessPayload = { ...payload };

        if (!accessToken) throw new Forbidden({ requestCode: RequestErrorCodeEnum.FORBIDDEN });
        return { ...payload, accessToken };
    }
}
