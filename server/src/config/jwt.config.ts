import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;

export const jwtConfig = {
    algorithm: env.ALGORITHM,
    access: {
        secret: env.ACCESSTOKEN_SECRET,
        expire: env.ACCESSTOKEN_EXPIRE,
    },
    refresh: {
        secret: env.REFRESHTOKEN_SECRET,
        expire: env.REFRESHTOKEN_EXPIRE,
    },
};
