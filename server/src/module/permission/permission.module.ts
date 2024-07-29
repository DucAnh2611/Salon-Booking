import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { PermissionEntity } from './entity/permission.entity';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
    imports: [TypeOrmModule.forFeature([PermissionEntity]), RoleModule, RolePermissionModule],
    controllers: [PermissionController],
    providers: [PermissionService, PermissionGuard, UserTypeGuard],
    exports: [PermissionService],
})
export class PermissionModule {}
