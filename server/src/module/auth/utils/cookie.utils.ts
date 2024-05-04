import { Injectable } from '@nestjs/common';
import { CookieOptions, Response } from 'express';

@Injectable()
export class CookieUtil {
  constructor() {}

  setCookie(res: Response, name: string, data: string, options: CookieOptions) {
    return res.cookie(name, data, options);
  }

  clearCookie(res: Response, name: string, options?: CookieOptions) {
    return res.clearCookie(name, options);
  }
}
