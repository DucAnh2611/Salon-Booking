import { Module } from '@nestjs/common';
import { OrderBaseModule } from '../order-base/order-base.module';
import { OrderProductItemModule } from '../order-product-item/order-product-item.module';
import { OrderServiceItemModule } from '../order-service-item/order-service-item.module';
import { OrderTransactionModule } from '../order-transaction/order-transaction.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
    imports: [OrderBaseModule, OrderProductItemModule, OrderServiceItemModule, OrderTransactionModule],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService],
})
export class OrderModule {}
