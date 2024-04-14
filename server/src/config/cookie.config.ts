import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;

export const cookieConfig = {
  name: env.COOKIE_NAME,
  expire: env.COOKIE_EXPIRE,
};
