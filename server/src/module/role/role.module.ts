import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { RedisModule } from '../redis/redis.module';
import { RolePermissionEntity } from '../role-permission/entity/role-permission.entity';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { RoleEntity } from './enitty/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
    imports: [RedisModule, TypeOrmModule.forFeature([RoleEntity, RolePermissionEntity])],
    controllers: [RoleController],
    providers: [RoleService, RolePermissionService, PermissionGuard],
    exports: [RoleService],
})
export class RoleModule {}
