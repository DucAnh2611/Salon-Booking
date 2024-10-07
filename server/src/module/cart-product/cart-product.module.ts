import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartProductItemModule } from '../cart-product-item/cart-product-item.module';
import { ProductTypesEntity } from '../product-types/entity/product-types.entity';
import { RoleModule } from '../role/role.module';
import { CartProductController } from './cart-product.controller';
import { CartProductService } from './cart-product.service';
import { CartProductEntity } from './entity/cart-product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CartProductEntity, ProductTypesEntity]), CartProductItemModule, RoleModule],
    controllers: [CartProductController],
    providers: [CartProductService],
    exports: [CartProductService],
})
export class CartProductModule {}
