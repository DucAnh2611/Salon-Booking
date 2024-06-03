import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionModule } from '../permission/permission.module';
import { RolePermissionEntity } from './entity/role-permission.entity';
import { RolePermissionService } from './role-permission.service';

@Module({
    imports: [TypeOrmModule.forFeature([RolePermissionEntity]), PermissionModule],
    providers: [RolePermissionService],
    exports: [RolePermissionService],
})
export class RolePermissionModule {}
