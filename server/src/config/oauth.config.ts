import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;

export const oauthConfig = {
    facebook: {
        secret: env.FACEBOOK_OAUTH_SECRET,
        appId: env.FACEBOOK_OAUTH_ID,
    },
    google: {
        clientId: env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
    },
    callbackUrl: env.OAUTH_CALLBACK_URL,
};
