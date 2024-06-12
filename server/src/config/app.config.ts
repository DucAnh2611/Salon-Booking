import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;

export const appConfig = {
    host: env.APP_HOST,
    url: env.APP_URL,
    port: env.APP_PORT,
    env: env.NODE_ENV,
    prefix: env.APP_PREFIX,
    clientUrl: env.APP_CLIENT_URL,
    employeeUrl: env.APP_EMPLOYEE_URL,
};
