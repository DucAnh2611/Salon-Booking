import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;

export const settingConfig = {
    name: env.SETTING_REDIS_NAME || '',
    otpVerifyEmail: env.SETTING_OTP_MAIL_EXPIRED || '',
    orderServiceConfirm: env.SETTING_ORDER_SERVICE_CONFIRM || '',
    resetPassword: env.SETTING_RESET_PASSWORD_EXPIRED || '',
};
