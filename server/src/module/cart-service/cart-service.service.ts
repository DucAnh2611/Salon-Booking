import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TAX_RATE } from '../../common/constant/order.contant';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { Forbidden } from '../../shared/exception/error.exception';
import { CartServiceItemService } from '../cart-service-item/cart-service-item.service';
import { CreateCartServiceItemDto } from '../cart-service-item/dto/cart-service-item-create.dto';
import { GetCartServiceAmountDto } from '../cart-service-item/dto/cart-service-item-get.dto';
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

    async removeCartItem(clientId: string, itemIds: string[]) {
        const cart = await this.cartServiceRepository.findOne({ where: { clientId }, loadEagerRelations: false });

        await this.cartServiceItemService.removeList(cart.id, itemIds);

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

    async calculateAmount(clientId: string, body: GetCartServiceAmountDto) {
        const { cartServiceId } = body;
        await this.isOwnCart(clientId, cartServiceId);

        const cartAmount = await this.cartServiceItemService.getTotalAmount(body);

        const tax = TAX_RATE;
        const taxAmount = Math.floor(tax * cartAmount);

        return {
            tax,
            taxAmount,
            cartAmount,
            total: taxAmount + cartAmount,
        };
    }

    async count(clientId: string) {
        const cart = await this.getClientCart(clientId);
        return this.cartServiceItemService.count(cart.id);
    }

    async get(clientId: string) {
        const cart = await this.getClientCart(clientId);
        const cartDetail = await this.cartServiceItemService.get(cart.id);

        return { ...cart, services: cartDetail };
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
