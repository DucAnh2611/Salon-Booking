import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OAUTH_CONSTANT } from '../../common/constant/oauth.constant';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard(OAUTH_CONSTANT.GOOGLE.strategyName) {
    constructor() {
        super({ accessType: 'offline' });
    }
}
