import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;

export const redisConfig = {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
};
