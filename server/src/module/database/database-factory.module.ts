import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { appConfig } from '../../config/app.config';
import { databaseConfig } from '../../config/db.config';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
        return {
            type: 'postgres',
            host: databaseConfig.host,
            port: databaseConfig.port,
            username: databaseConfig.user,
            password: databaseConfig.password,
            database: databaseConfig.name,
            entities: [__dirname + '/../*/**/*.entity.ts'],
            synchronize: databaseConfig.synchronize,
            dropSchema: false,
            logging: appConfig.env !== 'production',
            extra: {
                max: databaseConfig.maxConnection,
            },
        };
    }
}
