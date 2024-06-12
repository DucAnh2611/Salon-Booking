import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;
export const mailerConfig = {
    host: env.EMAIL_HOST,
    port: parseInt(env.EMAIL_PORT),
    ignoreTLS: Boolean(env.EMAIL_IGNORE_TLS),
    requireTLS: Boolean(env.EMAIL_REQUIRE_TLS),
    secure: env.EMAIL_SECURE,
    user: env.EMAIL_USER,
    password: env.EMAIL_PASSWORD,
    defaultTemplate: __dirname + '/../module/mail/mail-templates/default.hbs',
};

export const TEMPLATE_PATH = __dirname + '/../module/mail/mail-templates/';
