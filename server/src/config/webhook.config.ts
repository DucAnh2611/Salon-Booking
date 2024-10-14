import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;

export const webhookConfig = {
    apiKey: {
        sePay: env.APIKEY_SEPAY,
    },
};
