import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleEntity } from '../role/entity/role.entity';
import { RoleModule } from '../role/role.module';
import { AttributeService } from './attribute.service';
import { AttributeAdminController } from './controller/attribute-admin.controller';
import { AttributeEntity } from './entity/attribute.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AttributeEntity, RoleEntity]), RoleModule, RolePermissionModule],
    controllers: [AttributeAdminController],
    providers: [AttributeService, UserTypeGuard, AccessTokenGuard, PermissionGuard],
    exports: [AttributeService],
})
export class AttributeModule {}
