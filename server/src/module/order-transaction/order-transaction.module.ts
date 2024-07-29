import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderBaseModule } from '../order-base/order-base.module';
import { OrderProductItemModule } from '../order-product-item/order-product-item.module';
import { OrderServiceItemModule } from '../order-service-item/order-service-item.module';
import { OrderTransactionEntity } from './entity/order-transaction.entity';
import { OrderTransactionService } from './order-transaction.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderTransactionEntity]),
        OrderBaseModule,
        OrderProductItemModule,
        OrderServiceItemModule,
    ],
    providers: [OrderTransactionService],
    exports: [OrderTransactionService],
})
export class OrderTransactionModule {}
