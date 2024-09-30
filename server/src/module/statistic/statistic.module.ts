import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from '../client/entity/client.entity';
import { OrderRefundRequestEntity } from '../oder-refund-request/entity/order-refund-request.entity';
import { OrderEntity } from '../order-base/entity/order-base.entity';
import { OrderProductItemEntity } from '../order-product-item/entity/order-product-item.entity';
import { OrderServiceItemEntity } from '../order-service-item/entity/order-service-item.entity';
import { OrderTransactionEntity } from '../order-transaction/entity/order-transaction.entity';
import { ProductBaseEntity } from '../product-base/entity/product-base.entity';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { ServiceEntity } from '../service-base/entity/service.entity';
import { ShiftEmployeeEntity } from '../shift-employee/entity/shift-employee.entity';
import { StatisticAdminController } from './controller/statistic-admin.controller';
import { StatisticAdminService } from './service/statistic-admin.service';
import { StatisticService } from './service/statistic.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ServiceEntity,
            ProductBaseEntity,
            OrderEntity,
            OrderTransactionEntity,
            OrderRefundRequestEntity,
            OrderServiceItemEntity,
            OrderProductItemEntity,
            ShiftEmployeeEntity,
            ClientEntity,
        ]),
        RoleModule,
        RolePermissionModule,
    ],
    controllers: [StatisticAdminController],
    providers: [StatisticService, StatisticAdminService],
    exports: [],
})
export class StatisticModule {}
