import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { ProductBaseEntity } from '../product-base/entity/product-base.entity';
import { ProductTypesEntity } from '../product-types/entity/product-types.entity';
import { CreateCartProductItemDto } from './dto/cart-product-item-create.dto';
import { UpdateCartProductItemDto } from './dto/cart-product-item-update.dto';
import { CartProductItemEntity } from './entity/cart-product-item.entity';

@Injectable()
export class CartProductItemService {
    constructor(
        @InjectRepository(CartProductItemEntity)
        private readonly cartProductItemRepository: Repository<CartProductItemEntity>,
        @InjectRepository(ProductTypesEntity) private readonly productTypesRepository: Repository<ProductTypesEntity>,
        @InjectRepository(ProductBaseEntity) private readonly productBaseRepository: Repository<ProductBaseEntity>,
    ) {}

    isExist(id: string) {
        return this.cartProductItemRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    async isExistProduct(cartProductId: string, productId: string, productTypeId?: string) {
        const cartProduct = await this.cartProductItemRepository.find({
            where: { cartProductId: cartProductId, productId },
            loadEagerRelations: false,
        });

        if (!cartProduct.length) {
            return false;
        }

        if (productTypeId) {
            const type = cartProduct.find(p => p.productTypeId === productTypeId);
            return type;
        }
        return cartProduct.find(p => !p.productTypeId);
    }

    async isValidProduct(productId: string, productTypeId?: string) {
        if (productTypeId) {
            const productType = await this.productTypesRepository.findOne({
                where: { id: productTypeId },
                loadEagerRelations: false,
            });
            if (!productType) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT_TYPE });
            }

            if (productType.productId !== productId) {
                throw new BadRequest({ message: DataErrorCodeEnum.TYPES_NOT_MATCH });
            }

            return true;
        }

        const product = await this.productBaseRepository.findOne({
            where: { id: productId },
            loadEagerRelations: false,
        });
        if (!product) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT });
        }

        const productTypes = await this.productTypesRepository.find({
            where: { productId },
            loadEagerRelations: false,
        });

        if (productTypes.length) {
            throw new BadRequest({ message: DataErrorCodeEnum.PRODUCT_TYPE_REQUIRE });
        }

        return true;
    }

    get(cartProductId: string) {
        const querybuilder = this.cartProductItemRepository.createQueryBuilder('pc');

        const query = querybuilder
            .withDeleted()
            .leftJoinAndSelect('pc.product', 'product')
            .leftJoinAndSelect('pc.productType', 'product_type')
            .where(['pc', 'pc.product', 'pc.productType'])
            .where('pc.cartProductId :id', { id: cartProductId });

        return query.getMany();
    }

    async add(cartProductId: string, body: CreateCartProductItemDto) {
        const { productId, productTypeId, quantity } = body;

        const instance = this.cartProductItemRepository.create({
            productId,
            productTypeId,
            cartProductId: cartProductId,
            quantity,
        });

        const isExistInCart = await this.isExistProduct(cartProductId, productId, productTypeId);
        if (isExistInCart) {
            instance.quantity += isExistInCart.quantity;
        }

        return this.cartProductItemRepository.save(instance);
    }

    async update(cartProductId: string, body: UpdateCartProductItemDto) {
        const { id, quantity, productTypeId } = body;

        const isExist = await this.isExist(id);
        if (!isExist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT_CART_ITEM });
        }
        const instance = this.cartProductItemRepository.create({
            ...isExist,
            quantity,
            productTypeId,
        });

        await this.isValidProduct(isExist.productId, productTypeId);

        const isExistProduct = await this.isExistProduct(cartProductId, isExist.productId, productTypeId);
        if (isExistProduct) {
            if (id !== isExistProduct.id) {
                throw new BadRequest({ message: DataErrorCodeEnum.EXISTED_PRODUCT_CART_ITEM });
            }
        }

        return this.cartProductItemRepository.save(instance);
    }

    async remove(id: string) {
        const isExist = await this.isExist(id);
        if (!isExist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT_CART });
        }

        const remove = await this.cartProductItemRepository.delete({ id });

        return DataSuccessCodeEnum.OK;
    }
}
