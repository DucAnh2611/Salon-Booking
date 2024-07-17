import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest, Forbidden } from '../../shared/exception/error.exception';
import { CartServiceItemService } from '../cart-service-item/cart-service-item.service';
import { CreateCartServiceItemDto } from '../cart-service-item/dto/cart-service-item-create.dto';
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

    async isCartActive(id: string) {
        const cart = await this.isExist(id);
        if (!cart) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_CART });
        }
        return cart.isActive;
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
        let cartProduct = await this.getCartActive(clientId);
        if (!cartProduct) {
            const instance = this.cartServiceRepository.create({
                clientId,
            });

            cartProduct = await this.cartServiceRepository.save(instance);
        }
        return cartProduct;
    }

    getCartActive(clientId: string) {
        return this.cartServiceRepository.findOne({ where: { clientId, isActive: true }, loadEagerRelations: false });
    }

    async get(clientId: string) {
        const cart = await this.getClientCart(clientId);

        await this.isOwnCart(clientId, cart.id);

        return this.cartServiceItemService.get(cart.id);
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
