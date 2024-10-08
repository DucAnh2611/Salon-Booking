import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankModule } from '../bank/bank.module';
import { OrderRefundStateModule } from '../order-refund-state/order-refund-state.module';
import { OrderRefundRequestEntity } from './entity/order-refund-request.entity';
import { OrderRefundRequestService } from './order-refund-request.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrderRefundRequestEntity]), OrderRefundStateModule, BankModule],
    providers: [OrderRefundRequestService],
    exports: [OrderRefundRequestService],
})
export class OrderRefundRequestModule {}
