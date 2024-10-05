import { Module } from '@nestjs/common';
import { BankModule } from '../bank/bank.module';
import { CartProductModule } from '../cart-product/cart-product.module';
import { CartServiceModule } from '../cart-service/cart-service.module';
import { ClientModule } from '../client/client.module';
import { OrderRefundRequestModule } from '../oder-refund-request/order-refund-request.module';
import { OrderBaseModule } from '../order-base/order-base.module';
import { OrderProductItemModule } from '../order-product-item/order-product-item.module';
import { OrderRefundStateModule } from '../order-refund-state/order-refund-state.module';
import { OrderServiceItemModule } from '../order-service-item/order-service-item.module';
import { OrderStateModule } from '../order-state/order-state.module';
import { OrderTransactionModule } from '../order-transaction/order-transaction.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { ShiftEmployeeModule } from '../shift-employee/shift-employee.module';
import { UserModule } from '../user/user.module';
import { OrderAdminController } from './controller/order-admin.controller';
import { OrderController } from './controller/order.controller';
import { OrderGateway } from './gateways/order.gateway';
import { OrderAdminService } from './service/order-admin.service';
import { OrderService } from './service/order.service';

@Module({
    imports: [
        OrderBaseModule,
        OrderProductItemModule,
        OrderServiceItemModule,
        OrderTransactionModule,
        OrderStateModule,
        OrderRefundRequestModule,
        OrderRefundStateModule,
        CartProductModule,
        CartServiceModule,
        ClientModule,
        ShiftEmployeeModule,
        RoleModule,
        RolePermissionModule,
        UserModule,
        BankModule,
    ],
    controllers: [OrderController, OrderAdminController],
    providers: [OrderService, OrderAdminService, OrderGateway],
    exports: [OrderService],
})
export class OrderModule {}
