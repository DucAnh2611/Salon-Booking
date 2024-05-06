import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AUTH_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { cookieConfig } from '../../config/cookie.config';
import { jwtConfig } from '../../config/jwt.config';
import { CookieService } from '../../shared/global/cookie/cookie.service';
import { TimeUtil } from '../../shared/utils/parse-time.util';
import { AuthService } from './auth.service';
import { LoginEmpDto } from './dto/auth-login.dto';
import { CreateEmpDto } from './dto/create-auth.dto';

@Controller(ROUTER.AUTH)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post(AUTH_ROUTE.EMP_LOGIN)
  async empLogin(@Body() authEmp: LoginEmpDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.empLogin(authEmp);

    console.log(TimeUtil.toMilisecond({ time: jwtConfig.refresh.expire }));

    this.cookieService.setCookie(
      res,
      cookieConfig.refreshtoken.name,
      accessToken,
      cookieConfig.options({
        maxAge: TimeUtil.toMilisecond({ time: jwtConfig.refresh.expire }),
      }),
    );

    this.cookieService.setCookie(
      res,
      cookieConfig.accesstoken.name,
      refreshToken,
      cookieConfig.options({
        maxAge: TimeUtil.toMilisecond({ time: jwtConfig.access.expire }),
      }),
    );

    return { accessToken, refreshToken };
  }

  @Post(AUTH_ROUTE.EMP_REGISTER)
  clientRegister(@Body() newEmp: CreateEmpDto) {
    return this.authService.empSignup(newEmp);
  }

  @Get(AUTH_ROUTE.REFRESH_TOKEN)
  refreshToken() {
    return 'ok';
  }
}
