import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;
export const mailerConfig = {
  host: env.EMAIL_HOST,
  port: parseInt(env.EMAIL_PORT),
  secure: env.EMAIL_SECURE,
  user: env.EMAIL_USER,
  password: env.EMAIL_PASSWORD,
  template: { resetPassword: '', confirmSignup: '' },
};
