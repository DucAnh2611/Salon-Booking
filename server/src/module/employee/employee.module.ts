import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { RolePermissionEntity } from '../role-permission/entity/role-permission.entity';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { RoleEntity } from '../role/entity/role.entity';
import { RoleModule } from '../role/role.module';
import { RoleService } from '../role/role.service';
import { UserModule } from '../user/user.module';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { EmployeeEntity } from './entity/employee.entity';

@Module({
    imports: [TypeOrmModule.forFeature([EmployeeEntity, RoleEntity, RolePermissionEntity]), RoleModule, UserModule],
    controllers: [EmployeeController],
    providers: [EmployeeService, RoleService, RolePermissionService, PermissionGuard],
})
export class EmployeeModule {}
