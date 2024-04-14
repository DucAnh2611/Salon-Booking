import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;

export const databaseConfig = {
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  name: env.DB_NAME,
};
