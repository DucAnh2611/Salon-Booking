import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { MediaModule } from '../media/media.module';
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
    imports: [
        TypeOrmModule.forFeature([EmployeeEntity, RoleEntity, RolePermissionEntity]),
        RoleModule,
        UserModule,
        MediaModule,
    ],
    controllers: [EmployeeController],
    providers: [EmployeeService, RoleService, RolePermissionService, PermissionGuard],
    exports: [EmployeeService],
})
export class EmployeeModule {}
