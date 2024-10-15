import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import ngrok from '@ngrok/ngrok';
import CookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { configs } from './config';
import { appConfig } from './config/app.config';
import { AppLoggerService } from './module/logger/logger.service';
import { AppClassValidatorException } from './shared/exception/class-validator.exception';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix(configs.app.prefix);

    app.enableCors({
        // origin: '*',
        origin: [appConfig.clientUrl, appConfig.employeeUrl],
        methods: ['POST', 'PUT', 'DELETE', 'PATCH', 'GET', 'OPTIONS'],
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            exceptionFactory: AppClassValidatorException,
        }),
    );

    app.use(CookieParser());

    app.listen(configs.app.port).then(async () => {
        new AppLoggerService('Main', 'Start Server').info(`Backend server is running on port: ${configs.app.port}`);

        if (configs.app.env === 'dev') {
            const ngrokForward = await ngrok.connect({
                addr: parseInt(configs.app.port),
                authtoken_from_env: true,
            });

            new AppLoggerService('Main', 'Start Ngrok').info(
                `ngrok is listening to port ${configs.app.port} with domain: ${ngrokForward.url()}`,
            );
        }
    });
}
bootstrap();
