import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import CookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { configs } from './config';
import { appConfig } from './config/app.config';
import { AppClassValidatorException } from './exception/class-validator.exception';
import { AppLoggerService } from './module/logger/logger.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix(configs.app.prefix);

    app.enableCors({
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
    });
}
bootstrap();
