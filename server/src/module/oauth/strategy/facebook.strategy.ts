import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy } from 'passport-facebook';
import { OAUTH_CONSTANT } from '../../../common/constant/oauth.constant';
import { OAUTH_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { appConfig } from '../../../config/app.config';
import { oauthConfig } from '../../../config/oauth.config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, OAUTH_CONSTANT.FACEBOOK.strategyName) {
    constructor() {
        super({
            clientID: oauthConfig.facebook.appId,
            clientSecret: oauthConfig.facebook.secret,
            callbackURL: [oauthConfig.callbackUrl, appConfig.prefix, ROUTER.OAUTH, OAUTH_ROUTE.FACEBOOK_REDIRECT].join(
                '/',
            ),
            profileFields: ['email', 'id', 'first_name', 'gender', 'last_name', 'picture', 'name', 'name_format'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void,
    ): Promise<any> {
        const user = {
            ...profile,
            accessToken,
            refreshToken,
        };

        done(null, user);
    }
}
