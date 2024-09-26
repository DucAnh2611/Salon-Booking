import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderServiceItemEntity } from '../order-service-item/entity/order-service-item.entity';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { WorkingHourAdminController } from './controller/working-hour-admin.controller';
import { WorkingHourEntity } from './entity/working-hour.entity';
import { WorkingHourService } from './working-hour.service';

@Module({
    imports: [TypeOrmModule.forFeature([WorkingHourEntity, OrderServiceItemEntity]), RoleModule, RolePermissionModule],
    controllers: [WorkingHourAdminController],
    providers: [WorkingHourService],
    exports: [WorkingHourService],
})
export class WorkingHourModule {}
