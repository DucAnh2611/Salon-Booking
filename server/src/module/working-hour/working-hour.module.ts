import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from '../employee/entity/employee.entity';
import { OrderServiceItemEntity } from '../order-service-item/entity/order-service-item.entity';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { ShiftEntity } from '../shift/entity/shift.entity';
import { WorkingHourAdminController } from './controller/working-hour-admin.controller';
import { WorkingHourEntity } from './entity/working-hour.entity';
import { WorkingHourService } from './working-hour.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([WorkingHourEntity, OrderServiceItemEntity, EmployeeEntity, ShiftEntity]),
        RoleModule,
        RolePermissionModule,
    ],
    controllers: [WorkingHourAdminController],
    providers: [WorkingHourService],
    exports: [WorkingHourService],
})
export class WorkingHourModule {}
