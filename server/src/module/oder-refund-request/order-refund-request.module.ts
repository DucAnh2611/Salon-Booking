import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRefundStateModule } from '../order-refund-state/order-refund-state.module';
import { OrderRefundRequestEntity } from './entity/order-refund-request.entity';
import { OrderRefundRequestService } from './order-refund-request.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrderRefundRequestEntity]), OrderRefundStateModule],
    providers: [OrderRefundRequestService],
    exports: [OrderRefundRequestService],
})
export class OrderRefundRequestModule {}
