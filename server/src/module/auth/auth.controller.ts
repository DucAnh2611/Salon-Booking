import { Body, Controller, Get, Post, Req, Res, SerializeOptions, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AUTH_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { cookieConfig } from '../../config/cookie.config';
import { jwtConfig } from '../../config/jwt.config';
import { CookieService } from '../../shared/global/cookie/cookie.service';
import { RefreshTokenGuard } from '../../shared/guard/refreshToken.guard';
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
            cookieConfig.accesstoken.name,
            accessToken,
            cookieConfig.options({
                maxAge: TimeUtil.toMilisecond({ time: jwtConfig.access.expire }),
            }),
        );

        this.cookieService.setCookie(
            res,
            cookieConfig.refreshtoken.name,
            refreshToken,
            cookieConfig.options({
                maxAge: TimeUtil.toMilisecond({ time: jwtConfig.refresh.expire }),
            }),
        );

        return DataSuccessCodeEnum.OK;
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
            cookieConfig.accesstoken.name,
            accessToken,
            cookieConfig.options({
                maxAge: TimeUtil.toMilisecond({ time: jwtConfig.access.expire }),
            }),
        );

        this.cookieService.setCookie(
            res,
            cookieConfig.refreshtoken.name,
            refreshToken,
            cookieConfig.options({
                maxAge: TimeUtil.toMilisecond({ time: jwtConfig.refresh.expire }),
            }),
        );

        return DataSuccessCodeEnum.OK;
    }

    @Get(AUTH_ROUTE.REFRESH_TOKEN)
    @UseGuards(RefreshTokenGuard)
    async refreshToken(@Req() req: AppRequest, @Res({ passthrough: true }) res: Response) {
        const { refreshPayload } = req;
        const { accessToken, refreshToken } = await this.authService.refreshTokens(refreshPayload);

        this.cookieService.setCookie(
            res,
            cookieConfig.accesstoken.name,
            accessToken,
            cookieConfig.options({
                maxAge: TimeUtil.toMilisecond({ time: jwtConfig.access.expire }),
            }),
        );

        this.cookieService.setCookie(
            res,
            cookieConfig.refreshtoken.name,
            refreshToken,
            cookieConfig.options({
                maxAge: TimeUtil.toMilisecond({ time: jwtConfig.refresh.expire }),
            }),
        );

        return DataSuccessCodeEnum.OK;
    }
}
