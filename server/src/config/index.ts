import { appConfig } from './app.config';
import { cookieConfig } from './cookie.config';
import { databaseConfig } from './db.config';
import { jwtConfig } from './jwt.config';
import { winstonLoggerConfig } from './logger-winston.config';
import { mailerConfig } from './mailer.config';
import { oauthConfig } from './oauth.config';
import { redisConfig } from './redis.config';

export const configs = {
    app: appConfig,
    db: databaseConfig,
    jwt: jwtConfig,
    cookie: cookieConfig,
    redis: redisConfig,
    winstonLogger: winstonLoggerConfig,
    mailer: mailerConfig,
    oauth: oauthConfig,
};
