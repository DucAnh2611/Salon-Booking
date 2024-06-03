import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { PermissionEntity } from '../../permission/entity/permission.entity';
import { RolePermissionEntity } from '../../role-permission/entity/role-permission.entity';
import { RoleEntity } from '../../role/enitty/role.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { DatabaseConfigService } from '../database-factory.module';
import { SeedService } from './seed.service';

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
        TypeOrmModule.forFeature([UserEntity, EmployeeEntity, RoleEntity, PermissionEntity, RolePermissionEntity]),
    ],
    providers: [SeedService],
    exports: [SeedService],
})
export class SeedModule {}
