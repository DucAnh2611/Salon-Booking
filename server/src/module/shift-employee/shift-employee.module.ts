import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { ShiftModule } from '../shift/shift.module';
import { ShiftEmployeeAdminController } from './controller/shift-employee-admin.controller';
import { ShiftEmployeeEntity } from './entity/shift-employee.entity';
import { ShiftEmployeeService } from './shift-employee.service';

@Module({
    imports: [TypeOrmModule.forFeature([ShiftEmployeeEntity]), ShiftModule, RoleModule, RolePermissionModule],
    controllers: [ShiftEmployeeAdminController],
    providers: [ShiftEmployeeService],
    exports: [ShiftEmployeeService],
})
export class ShiftEmployeeModule {}
