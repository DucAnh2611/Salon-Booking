import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { redisConfig } from '../../config/redis.config';

export const RedisOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    useFactory: async () => ({
        store: await redisStore({
            socket: {
                host: redisConfig.host,
                port: parseInt(redisConfig.port),
            },
            username: redisConfig.username,
            password: redisConfig.password,
        }),
    }),
};

export const REDIS_KEY = {
    ROLE_PERMISSION: 'ROLE_PERMISSION',
};
export const REDIS_OTP_FORMAT = {
    USER_ID: 'USER_ID',
    CLIENT_ID: 'CLIENT_ID',
    EMAIL: 'EMAIL',
};

export const REDIS_EMAIL_OTP_FORMAT = 'otp_email_<USER_ID>_<CLIENT_ID>_<EMAIL>';
