import { Injectable } from '@nestjs/common';
import { CookieUtil } from './utils/cookie.utils';
import { HashPasswordUtil } from './utils/hash-password.utils';
import { JwtTokenUtil } from './utils/token.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtTokenUtil: JwtTokenUtil,
    private readonly hashPasswordUtil: HashPasswordUtil,
    private readonly cookieUtil: CookieUtil,
  ) {}

  signup() {
    //TODO AUTH_signup - check exist by email
    //TODO AUTH_signup - insert if valid and return
  }

  login() {
    //TODO AUTH_login - check exist by email
    //TODO AUTH_login - if exist check is password matched
    //TODO AUTH_login - if matched return accessToken and setCookie refreshToken
  }

  logout() {
    //TODO AUTH_logout - clear cookies
  }

  refreshAccessToken() {}
}
