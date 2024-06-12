import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { RolePermissionEntity } from '../role-permission/entity/role-permission.entity';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { RoleEntity } from '../role/enitty/role.entity';
import { RoleService } from '../role/role.service';
import { PermissionEntity } from './entity/permission.entity';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
    imports: [TypeOrmModule.forFeature([PermissionEntity, RoleEntity, RolePermissionEntity])],
    controllers: [PermissionController],
    providers: [PermissionService, RoleService, RolePermissionService, PermissionGuard],
    exports: [PermissionService],
})
export class PermissionModule {}
