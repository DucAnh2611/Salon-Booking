import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { Forbidden } from '../../shared/exception/error.exception';
import { CartProductItemService } from '../cart-product-item/cart-product-item.service';
import { CreateCartProductItemDto } from '../cart-product-item/dto/cart-product-item-create.dto';
import { UpdateCartProductItemDto } from '../cart-product-item/dto/cart-product-item-update.dto';
import { CartProductEntity } from './entity/cart-product.entity';

@Injectable()
export class CartProductService {
    constructor(
        @InjectRepository(CartProductEntity) private readonly cartProductRepository: Repository<CartProductEntity>,
        private readonly cartProductItemService: CartProductItemService,
    ) {}

    isExist(id: string) {
        return this.cartProductRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    async isOwnCart(clientId: string, cartProductId: string) {
        const cart = await this.cartProductRepository.findOne({
            where: { id: cartProductId, clientId },
            loadEagerRelations: false,
        });
        if (!cart) {
            throw new Forbidden({ message: DataErrorCodeEnum.NOT_OWN_CART });
        }
        return cart;
    }

    getCartActive(clientId: string) {
        return this.cartProductRepository.findOne({ where: { clientId }, loadEagerRelations: false });
    }

    async getClientCart(clientId: string) {
        let cartProduct = await this.getCartActive(clientId);
        if (!cartProduct) {
            const instance = this.cartProductRepository.create({
                clientId,
            });

            cartProduct = await this.cartProductRepository.save(instance);
        }
        return cartProduct;
    }

    async get(clientId: string) {
        const cartProduct = await this.getClientCart(clientId);

        await this.isOwnCart(clientId, cartProduct.id);

        return this.cartProductItemService.get(cartProduct.id);
    }

    async add(clientId: string, body: CreateCartProductItemDto) {
        const cartProduct = await this.getClientCart(clientId);

        const savedProductItem = await this.cartProductItemService.add(cartProduct.id, body);

        return DataSuccessCodeEnum.OK;
    }

    async update(clientId: string, body: UpdateCartProductItemDto) {
        const cartProduct = await this.getClientCart(clientId);

        await this.isOwnCart(clientId, cartProduct.id);

        await this.cartProductItemService.update(cartProduct.id, body);

        return DataSuccessCodeEnum.OK;
    }

    async remove(clientId: string, cartProductItemId: string) {
        const cartProduct = await this.getClientCart(clientId);

        await this.isOwnCart(clientId, cartProduct.id);

        await this.cartProductItemService.remove(cartProductItemId);

        return DataSuccessCodeEnum.OK;
    }
}
