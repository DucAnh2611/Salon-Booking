import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OAUTH_CONSTANT } from '../../common/constant/oauth.constant';

@Injectable()
export class FacebookOAuthGuard extends AuthGuard(OAUTH_CONSTANT.FACEBOOK.strategyName) {
    constructor() {
        super({ accessType: 'offline' });
    }
}
