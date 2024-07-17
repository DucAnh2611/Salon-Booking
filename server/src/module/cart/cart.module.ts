import { Module } from '@nestjs/common';
import { CartProductModule } from '../cart-product/cart-product.module';
import { CartServiceModule } from '../cart-service/cart-service.module';

@Module({
    imports: [CartProductModule, CartServiceModule],
})
export class CartModule {}
