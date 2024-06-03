import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionModule } from '../permission/permission.module';
import { RedisModule } from '../redis/redis.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleEntity } from './enitty/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
    imports: [RedisModule, TypeOrmModule.forFeature([RoleEntity]), RolePermissionModule, PermissionModule],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService],
})
export class RoleModule {}
