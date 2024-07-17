import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order-base.entity';
import { OrderBaseService } from './order-base.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity])],
    providers: [OrderBaseService],
    exports: [OrderBaseService],
})
export class OrderBaseModule {}
