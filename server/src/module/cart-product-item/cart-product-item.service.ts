import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { ProductBaseEntity } from '../product-base/entity/product-base.entity';
import { ProductTypesEntity } from '../product-types/entity/product-types.entity';
import { CreateCartProductItemDto } from './dto/cart-product-item-create.dto';
import { GetCartProductAmountDto } from './dto/cart-product-item-get.dto';
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

    async getTotalAmount(body: GetCartProductAmountDto) {
        const { itemIds, cartProductId } = body;
        const itemLists = await this.cartProductItemRepository.find({
            where: { cartProductId, id: In(itemIds) },
            loadEagerRelations: false,
            relations: {
                product: true,
                productType: true,
            },
        });

        const sum = itemLists.reduce((acc, item) => {
            const { product, productType } = item;

            let unitPrice = product.price;
            if (productType) {
                unitPrice = productType.price;
            }

            return (acc += unitPrice * item.quantity);
        }, 0);

        return sum;
    }

    async removeList(cartProductId: string, itemIds: string[]) {
        const deleted = await this.cartProductItemRepository.delete({ cartProductId, id: In(itemIds) });
        return deleted;
    }

    async removeAll(cartProductId: string) {
        const deleted = await this.cartProductItemRepository.delete({ cartProductId });
        return deleted;
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

    async isValidProduct(item: CreateCartProductItemDto) {
        const { productId, quantity, productTypeId } = item;
        if (productTypeId) {
            const productType = await this.productTypesRepository.findOne({
                where: { id: productTypeId },
                loadEagerRelations: false,
            });
            if (!productType) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT_TYPE });
            }

            if (productType.quantity < quantity) {
                throw new BadRequest({ message: DataErrorCodeEnum.PRODUCT_TYPES_OUT_OF_STOCK });
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

        if (product.quantity < quantity) {
            throw new BadRequest({ message: DataErrorCodeEnum.PRODUCT_OUT_OF_STOCK });
        }

        return true;
    }

    count(cartProductId: string) {
        return this.cartProductItemRepository.count({ where: { cartProductId }, loadEagerRelations: false });
    }

    get(cartProductId: string) {
        return this.cartProductItemRepository.find({
            where: { cartProductId },
            loadEagerRelations: false,
            relations: {
                product: {
                    productMedia: {
                        media: true,
                    },
                    category: true,
                },
                productType: {
                    productTypesAttribute: {
                        value: {
                            attribute: true,
                        },
                        thumbnail: true,
                    },
                },
            },
            withDeleted: true,
        });
    }

    async add(cartProductId: string, body: CreateCartProductItemDto) {
        const { productId, productTypeId, quantity } = body;

        const isExistInCart = await this.isExistProduct(cartProductId, productId, productTypeId);

        let instance = this.cartProductItemRepository.create({
            productId,
            productTypeId,
            cartProductId: cartProductId,
            quantity: quantity,
        });

        if (isExistInCart) {
            instance = { ...isExistInCart };
            instance.quantity += quantity;
        }

        await this.isValidProduct({ productId: productId, productTypeId, quantity: instance.quantity });

        return this.cartProductItemRepository.save(instance);
    }

    async update(cartProductId: string, body: UpdateCartProductItemDto) {
        const { id, quantity } = body;

        const isExist = await this.isExist(id);
        if (!isExist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT_CART_ITEM });
        }
        const instance = this.cartProductItemRepository.create({
            ...isExist,
            quantity,
        });

        await this.isValidProduct({ productId: isExist.productId, productTypeId: isExist.productTypeId, quantity });

        const isExistProduct = await this.isExistProduct(cartProductId, isExist.productId, isExist.productTypeId);
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
