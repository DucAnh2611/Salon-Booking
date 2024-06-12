import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { RoleEntity } from '../role/enitty/role.entity';
import { RoleService } from '../role/role.service';
import { RolePermissionEntity } from './entity/role-permission.entity';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionService } from './role-permission.service';

@Module({
    imports: [TypeOrmModule.forFeature([RolePermissionEntity, RoleEntity])],
    controllers: [RolePermissionController],
    providers: [RolePermissionService, RoleService, PermissionGuard],
    exports: [RolePermissionService],
})
export class RolePermissionModule {}
