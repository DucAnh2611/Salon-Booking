import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStateEntity } from './entity/order-state.entity';
import { OrderStateService } from './order-state.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrderStateEntity])],
    providers: [OrderStateService],
    exports: [OrderStateService],
})
export class OrderStateModule {}
