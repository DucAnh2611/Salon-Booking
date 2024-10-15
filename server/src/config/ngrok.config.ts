import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;

export const ngrokConfig = {
    domain: env.NGROK_DOMAIN,
    authToken: env.NGROK_AUTHTOKEN,
};
