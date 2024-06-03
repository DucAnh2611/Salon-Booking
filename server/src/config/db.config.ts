import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;

export const databaseConfig = {
    type: env.DB_TYPE,
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    name: env.DB_NAME,
    defaultPassword: env.DEFAULT_PASSWORD,
    synchronize: Boolean(env.DB_SYNCHRONIZE),
    maxConnection: env.DB_MAX_CONNECTIONS,
    rejectUnauthorized: Boolean(env.DB_REJECT_UNAUTHORIZED),
    ssl: Boolean(env.DB_SSL_ENABLED),
    ca: env.DB_CA,
    key: env.DB_KEY,
    cert: env.DB_CERT,
};
