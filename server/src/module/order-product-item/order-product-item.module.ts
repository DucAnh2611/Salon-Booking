import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBaseEntity } from '../product-base/entity/product-base.entity';
import { ProductTypesEntity } from '../product-types/entity/product-types.entity';
import { OrderProductItemEntity } from './entity/order-product-item.entity';
import { OrderProductItemService } from './order-product-item.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrderProductItemEntity, ProductBaseEntity, ProductTypesEntity])],
    providers: [OrderProductItemService],
    exports: [OrderProductItemService],
})
export class OrderProductItemModule {}
