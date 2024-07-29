import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { Forbidden } from '../../shared/exception/error.exception';
import { CartServiceItemService } from '../cart-service-item/cart-service-item.service';
import { CreateCartServiceItemDto } from '../cart-service-item/dto/cart-service-item-create.dto';
import { TAX_RATE } from '../order-base/order-base.service';
import { CartServiceEntity } from './entity/cart-service.entity';

@Injectable()
export class CartServiceService {
    constructor(
        @InjectRepository(CartServiceEntity) private readonly cartServiceRepository: Repository<CartServiceEntity>,
        private readonly cartServiceItemService: CartServiceItemService,
    ) {}

    isExist(id: string) {
        return this.cartServiceRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    async removeCart(clientId: string) {
        const cart = await this.cartServiceRepository.findOne({ where: { clientId }, loadEagerRelations: false });

        const deletedCart = await this.cartServiceItemService.removeAll(cart.id);

        return DataSuccessCodeEnum.OK;
    }

    async isOwnCart(clientId: string, cartServiceId: string) {
        const cart = await this.cartServiceRepository.findOne({
            where: { id: cartServiceId, clientId },
            loadEagerRelations: false,
        });
        if (!cart) {
            throw new Forbidden({ message: DataErrorCodeEnum.NOT_OWN_CART });
        }
        return cart;
    }

    async getClientCart(clientId: string) {
        let cartProduct = await this.cartServiceRepository.findOne({ where: { clientId }, loadEagerRelations: false });
        if (!cartProduct) {
            const instance = this.cartServiceRepository.create({
                clientId,
            });

            cartProduct = await this.cartServiceRepository.save(instance);
        }
        return cartProduct;
    }

    async get(clientId: string) {
        const cart = await this.getClientCart(clientId);
        const cartDetail = await this.cartServiceItemService.get(cart.id);

        await this.isOwnCart(clientId, cart.id);

        const total = await this.cartServiceItemService.getTotalAmount(cart.id);
        const tax = TAX_RATE;
        const taxAmount = Math.round(total * (1 + tax));

        return { ...cart, services: cartDetail, tax, taxAmount, total };
    }

    async add(clientId: string, body: CreateCartServiceItemDto) {
        const cart = await this.getClientCart(clientId);

        const addCartServiceItem = await this.cartServiceItemService.create(cart.id, body);

        return DataSuccessCodeEnum.OK;
    }

    async delete(clientId: string, cartServiceItemId: string) {
        const cart = await this.getClientCart(clientId);

        await this.isOwnCart(clientId, cart.id);

        const deletedCartServiceItem = await this.cartServiceItemService.deleteOne(cartServiceItemId);

        return DataSuccessCodeEnum.OK;
    }
}
