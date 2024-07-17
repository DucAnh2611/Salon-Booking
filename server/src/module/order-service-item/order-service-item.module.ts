import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from '../employee/employee.module';
import { ServiceBaseModule } from '../service-base/service-base.module';
import { ServiceEmployeeModule } from '../service-employee/service-employee.module';
import { ShiftEmployeeModule } from '../shift-employee/shift-employee.module';
import { ShiftModule } from '../shift/shift.module';
import { OrderServiceItemEntity } from './entity/order-service-item.entity';
import { OrderServiceItemService } from './order-service-item.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderServiceItemEntity]),
        ServiceEmployeeModule,
        ServiceBaseModule,
        EmployeeModule,
        ShiftModule,
        ShiftEmployeeModule,
    ],
    providers: [OrderServiceItemService],
    exports: [OrderServiceItemService],
})
export class OrderServiceItemModule {}
