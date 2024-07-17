import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { WorkingHourModule } from '../working-hour/working-hour.module';
import { ShiftAdminController } from './controller/shift-admin.controller';
import { ShiftEntity } from './entity/shift.entity';
import { ShiftService } from './shift.service';

@Module({
    imports: [TypeOrmModule.forFeature([ShiftEntity]), WorkingHourModule, RoleModule, RolePermissionModule],
    controllers: [ShiftAdminController],
    providers: [ShiftService],
    exports: [ShiftService],
})
export class ShiftModule {}
