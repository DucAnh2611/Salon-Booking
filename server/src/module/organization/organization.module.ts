import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { OrganizationAdminController } from './controller/organization-admin.controller';
import { OrganizationController } from './controller/organization.controller';
import { OrganizationEntity } from './entity/organization.entity';
import { OrganizationAdminService } from './service/organization-admin.service';
import { OrganizationService } from './service/organization.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrganizationEntity]), RoleModule, RolePermissionModule],
    controllers: [OrganizationAdminController, OrganizationController],
    providers: [OrganizationService, OrganizationAdminService],
    exports: [],
})
export class OrganizationModule {}
