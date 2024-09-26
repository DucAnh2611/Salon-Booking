import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartProductItemEntity } from '../cart-product-item/entity/cart-product-item.entity';
import { ProductBaseEntity } from '../product-base/entity/product-base.entity';
import { ProductTypesEntity } from '../product-types/entity/product-types.entity';
import { OrderProductItemEntity } from './entity/order-product-item.entity';
import { OrderProductItemService } from './order-product-item.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrderProductItemEntity,
            ProductBaseEntity,
            ProductTypesEntity,
            CartProductItemEntity,
        ]),
    ],
    providers: [OrderProductItemService],
    exports: [OrderProductItemService],
})
export class OrderProductItemModule {}
