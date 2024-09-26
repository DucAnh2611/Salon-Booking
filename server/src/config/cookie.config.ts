import * as dotenv from 'dotenv';
import { CookieOptions } from 'express';

const env = dotenv.config().parsed;

export const cookieConfig = {
    name: env.COOKIE_NAME,
    expire: env.COOKIE_EXPIRE,
    accesstoken: {
        client: env.COOKIE_ACCESSTOKEN_CLIENT_NAME,
        manager: env.COOKIE_ACCESSTOKEN_MANAGER_NAME,
    },
    refreshtoken: {
        client: env.COOKIE_REFRESHTOKEN_CLIENT_NAME,
        manager: env.COOKIE_REFRESHTOKEN_MANAGER_NAME,
    },
    options: (options: Partial<CookieOptions>): CookieOptions => {
        return {
            ...JSON.parse(env.COOKIE_OPTIONS),
            ...options,
        };
    },
};
