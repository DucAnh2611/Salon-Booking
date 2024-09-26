import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OAUTH_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { AppRequestOAuth } from '../../common/interface/custom-request.interface';
import { FacebookOAuthGuard } from '../../shared/guard/facebook-oauth.guard';
import { GoogleOAuthGuard } from '../../shared/guard/google-oauth.guard';

@Controller(ROUTER.OAUTH)
export class OAuthController {
    constructor() {}

    @Get(OAUTH_ROUTE.GOOGLE)
    @UseGuards(GoogleOAuthGuard)
    async google() {
        return;
    }

    @Get(OAUTH_ROUTE.GOOGLE_REDIRECT)
    @UseGuards(GoogleOAuthGuard)
    async googleCallback(@Req() req: AppRequestOAuth) {
        const { user } = req;

        return { data: user };
    }

    @Get(OAUTH_ROUTE.FACEBOOK)
    @UseGuards(GoogleOAuthGuard)
    async googleLogin() {
        return;
    }

    @Get(OAUTH_ROUTE.FACEBOOK_REDIRECT)
    @UseGuards(FacebookOAuthGuard)
    async facebookCallback(@Req() req: AppRequestOAuth) {
        const { user } = req;

        return { data: 'Feature on maintaining!' };
    }
}
