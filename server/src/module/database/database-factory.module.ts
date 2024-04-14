import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
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
      entities: [],
      synchronize: true,
      dropSchema: true,
    };
  }
}
