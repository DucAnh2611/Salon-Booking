import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRefundRequestModule } from '../oder-refund-request/order-refund-request.module';
import { OrderBaseModule } from '../order-base/order-base.module';
import { OrderProductItemModule } from '../order-product-item/order-product-item.module';
import { OrderServiceItemModule } from '../order-service-item/order-service-item.module';
import { OrderTransactionEntity } from './entity/order-transaction.entity';
import { OrderTransactionService } from './order-transaction.service';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'payment_cancel',
            limiter: {
                max: 2,
                duration: 1000,
            },
        }),
        TypeOrmModule.forFeature([OrderTransactionEntity]),
        OrderBaseModule,
        OrderProductItemModule,
        OrderServiceItemModule,
        OrderRefundRequestModule,
    ],
    providers: [OrderTransactionService],
    exports: [OrderTransactionService],
})
export class OrderTransactionModule {}
