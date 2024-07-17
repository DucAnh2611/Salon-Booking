import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBaseEntity } from '../product-base/entity/product-base.entity';
import { ProductTypesEntity } from '../product-types/entity/product-types.entity';
import { CartProductItemService } from './cart-product-item.service';
import { CartProductItemEntity } from './entity/cart-product-item.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CartProductItemEntity, ProductBaseEntity, ProductTypesEntity])],
    providers: [CartProductItemService],
    exports: [CartProductItemService],
})
export class CartProductItemModule {}
