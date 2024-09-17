import { Body, Controller, Get, Post, Req, Res, SerializeOptions, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AUTH_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { cookieConfig } from '../../config/cookie.config';
import { jwtConfig } from '../../config/jwt.config';
import { CookieService } from '../../shared/global/cookie/cookie.service';
import { RefreshTokenClientGuard, RefreshTokenGuard } from '../../shared/guard/refreshToken.guard';
import { TimeUtil } from '../../shared/utils/parse-time.util';
import { RegisterClientDto } from '../client/dto/client-create.dto';
import { AuthService } from './auth.service';
import { LoginClientDto, LoginEmpDto } from './dto/auth-login.dto';
@SerializeOptions({ groups: ['auth'] })
@Controller(ROUTER.AUTH)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly cookieService: CookieService,
    ) {}

    @Post(AUTH_ROUTE.EMP_LOGIN)
    async empLogin(@Body() authEmp: LoginEmpDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken } = await this.authService.empLogin(authEmp);

        this.cookieService.setCookie(
            res,
            cookieConfig.accesstoken.manager,
            accessToken,
            cookieConfig.options({
                maxAge: TimeUtil.toMilisecond({ time: jwtConfig.access.expire }),
            }),
        );

        this.cookieService.setCookie(
            res,
            cookieConfig.refreshtoken.manager,
            refreshToken,
            cookieConfig.options({
                maxAge: TimeUtil.toMilisecond({ time: jwtConfig.refresh.expire }),
            }),
        );

        return {
            accessToken,
        };
    }

    @Post(AUTH_ROUTE.CLIENT_REGISTER)
    async clientRegister(@Body() newClient: RegisterClientDto) {
        return this.authService.clientRegister(newClient);
    }

    @Post(AUTH_ROUTE.CLIENT_LOGIN)
    async clientLogin(@Body() authClient: LoginClientDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken } = await this.authService.clientLogin(authClient);

        this.cookieService.setCookie(
            res,
            cookieConfig.accesstoken.client,
            accessToken,
            cookieConfig.options({
                maxAge: TimeUtil.toMilisecond({ time: jwtConfig.access.expire }),
            }),
        );

        this.cookieService.setCookie(
            res,
            cookieConfig.refreshtoken.client,
            refreshToken,
            cookieConfig.options({
                maxAge: TimeUtil.toMilisecond({ time: jwtConfig.refresh.expire }),
            }),
        );
        return {
            accessToken,
        };
    }

    @Get(AUTH_ROUTE.EMP_REFRESH_TOKEN)
    @UseGuards(RefreshTokenGuard)
    async refreshTokenManager(@Req() req: AppRequest, @Res({ passthrough: true }) res: Response) {
        const { refreshPayload } = req;
        const { accessToken, refreshToken } = await this.authService.refreshTokens(refreshPayload);

        this.cookieService.setCookie(
            res,
            cookieConfig.accesstoken.manager,
            accessToken,
            cookieConfig.options({
                maxAge: TimeUtil.toMilisecond({ time: jwtConfig.access.expire }),
            }),
        );

        this.cookieService.setCookie(
            res,
            cookieConfig.refreshtoken.manager,
            refreshToken,
            cookieConfig.options({
                maxAge: TimeUtil.toMilisecond({ time: jwtConfig.refresh.expire }),
            }),
        );

        return DataSuccessCodeEnum.OK;
    }

    @Get(AUTH_ROUTE.CLIENT_REFRESH_TOKEN)
    @UseGuards(RefreshTokenClientGuard)
    async refreshTokenClient(@Req() req: AppRequest, @Res({ passthrough: true }) res: Response) {
        const { refreshPayload } = req;
        const { accessToken, refreshToken } = await this.authService.refreshTokens(refreshPayload);

        this.cookieService.setCookie(
            res,
            cookieConfig.accesstoken.client,
            accessToken,
            cookieConfig.options({
                maxAge: TimeUtil.toMilisecond({ time: jwtConfig.access.expire }),
            }),
        );

        this.cookieService.setCookie(
            res,
            cookieConfig.refreshtoken.client,
            refreshToken,
            cookieConfig.options({
                maxAge: TimeUtil.toMilisecond({ time: jwtConfig.refresh.expire }),
            }),
        );

        return DataSuccessCodeEnum.OK;
    }

    @Get(AUTH_ROUTE.CLIENT_LOG_OUT)
    async clientLogout(@Req() req: AppRequest, @Res({ passthrough: true }) res: Response) {
        res.clearCookie(cookieConfig.refreshtoken.client);
        res.clearCookie(cookieConfig.accesstoken.client);
        return DataSuccessCodeEnum.OK;
    }

    @Get(AUTH_ROUTE.EMP_LOG_OUT)
    async managerLogout(@Req() req: AppRequest, @Res({ passthrough: true }) res: Response) {
        res.clearCookie(cookieConfig.refreshtoken.manager);
        res.clearCookie(cookieConfig.accesstoken.manager);
        return DataSuccessCodeEnum.OK;
    }
}
