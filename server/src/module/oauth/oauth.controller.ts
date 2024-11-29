import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OAUTH_ROUTE, ROUTER } from '../../constant/router.constant';
import { FacebookOAuthGuard } from '../../guard/facebook-oauth.guard';
import { GoogleOAuthGuard } from '../../guard/google-oauth.guard';
import { AppRequestOAuth } from '../../interface/custom-request.interface';

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
