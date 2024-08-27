import { Module } from '@nestjs/common';
import { CartProductModule } from '../cart-product/cart-product.module';
import { CartServiceModule } from '../cart-service/cart-service.module';
import { OrderRefundRequestModule } from '../oder-refund-request/order-refund-request.module';
import { OrderBaseModule } from '../order-base/order-base.module';
import { OrderProductItemModule } from '../order-product-item/order-product-item.module';
import { OrderRefundStateModule } from '../order-refund-state/order-refund-state.module';
import { OrderServiceItemModule } from '../order-service-item/order-service-item.module';
import { OrderStateModule } from '../order-state/order-state.module';
import { OrderTransactionModule } from '../order-transaction/order-transaction.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { OrderAdminController } from './controller/order-admin.controller';
import { OrderController } from './controller/order.controller';
import { OrderService } from './order.service';

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
        RoleModule,
        RolePermissionModule,
        UserModule,
    ],
    controllers: [OrderController, OrderAdminController],
    providers: [OrderService],
    exports: [OrderService],
})
export class OrderModule {}
