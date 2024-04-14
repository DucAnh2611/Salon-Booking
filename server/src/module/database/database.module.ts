import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DatabaseConfigService } from './database-factory.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DatabaseConfigService,
      dataSourceFactory: async options => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class DatabaseModule {}
