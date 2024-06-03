import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;

export const i18nConfig = {
    fallback: env.I18N_FALLBACK,
};
