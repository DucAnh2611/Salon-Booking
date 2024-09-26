import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from '../media/media.module';
import { OrderRefundStateEntity } from './entity/order-refund-state.entity';
import { OrderRefundStateService } from './order-refund-state.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrderRefundStateEntity]), MediaModule],
    providers: [OrderRefundStateService],
    exports: [OrderRefundStateService],
})
export class OrderRefundStateModule {}
