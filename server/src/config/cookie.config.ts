import * as dotenv from 'dotenv';
import { CookieOptions } from 'express';

const env = dotenv.config().parsed;

export const cookieConfig = {
    name: env.COOKIE_NAME,
    expire: env.COOKIE_EXPIRE,
    accesstoken: {
        name: env.COOKIE_ACCESSTOKEN_NAME,
    },
    refreshtoken: {
        name: env.COOKIE_ACCESSTOKEN_EXPIRE,
    },
    options: (options: Partial<CookieOptions>): CookieOptions => {
        return {
            ...JSON.parse(env.COOKIE_OPTIONS),
            ...options,
        };
    },
};
