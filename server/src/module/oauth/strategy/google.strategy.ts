import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { OAUTH_CONSTANT } from '../../../common/constant/oauth.constant';
import { OAUTH_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { appConfig } from '../../../config/app.config';
import { oauthConfig } from '../../../config/oauth.config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, OAUTH_CONSTANT.GOOGLE.strategyName) {
    constructor() {
        super({
            clientID: oauthConfig.google.clientId,
            clientSecret: oauthConfig.google.clientSecret,
            callbackURL: [oauthConfig.callbackUrl, appConfig.prefix, ROUTER.OAUTH, OAUTH_ROUTE.GOOGLE_REDIRECT].join(
                '/',
            ),
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
            refreshToken,
        };
        done(null, user);
    }
}
