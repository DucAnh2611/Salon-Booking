import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { CartProductItemEntity } from '../cart-product-item/entity/cart-product-item.entity';
import { ProductBaseEntity } from '../product-base/entity/product-base.entity';
import { ProductTypesEntity } from '../product-types/entity/product-types.entity';
import { CreateOrderProductItemDto } from './dto/order-product-item-create.dto';
import { OrderProductItemEntity } from './entity/order-product-item.entity';

@Injectable()
export class OrderProductItemService {
    constructor(
        @InjectRepository(OrderProductItemEntity)
        private readonly orderProductItemRepository: Repository<OrderProductItemEntity>,
        @InjectRepository(ProductBaseEntity)
        private readonly productBaseRepository: Repository<ProductBaseEntity>,
        @InjectRepository(ProductTypesEntity)
        private readonly productTypesRepository: Repository<ProductTypesEntity>,
        @InjectRepository(CartProductItemEntity)
        private readonly cartProductItemRepository: Repository<CartProductItemEntity>,
    ) {}

    async isItemInCart(itemId: string) {
        const isItemInCart = await this.cartProductItemRepository.findOne({
            where: { id: itemId },
            loadEagerRelations: false,
        });

        if (!isItemInCart) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT_CART_ITEM });
        }
        return isItemInCart;
    }

    async isValidProduct(item: CreateOrderProductItemDto) {
        const { itemId, quantity, productTypeId, productId } = item;

        const isItemInCart = await this.isItemInCart(itemId);

        if (
            productId !== isItemInCart.productId ||
            (productTypeId && isItemInCart.productTypeId && productTypeId !== isItemInCart.productTypeId)
        ) {
            throw new BadRequest({ message: DataErrorCodeEnum.PRODUCT_CART_ITEM_NOT_MATCH });
        }
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

        if (product.quantity < quantity) {
            throw new BadRequest({ message: DataErrorCodeEnum.PRODUCT_OUT_OF_STOCK });
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

    async getProductSnapshot(
        productId: string,
        productTypeId: string,
    ): Promise<[ProductBaseEntity, ProductTypesEntity | null]> {
        const [product, productType] = await Promise.all([
            this.productBaseRepository.findOne({
                where: { id: productId },
                loadEagerRelations: false,
                relations: {
                    category: true,
                    types: false,
                    productMedia: true,
                    productDetail: true,
                    userCreate: false,
                    userUpdate: false,
                },
            }),
            this.productTypesRepository.findOne({
                where: { id: productTypeId },
                loadEagerRelations: false,
                relations: {
                    productTypesAttribute: {
                        value: true,
                    },
                },
            }),
        ]);

        return [product, productType];
    }

    async checkValidListProduct(list: CreateOrderProductItemDto[]) {
        if (!list.length) {
            throw new BadRequest({ message: DataErrorCodeEnum.NO_ORDER_ITEM });
        }
        await Promise.all(list.map((item: CreateOrderProductItemDto) => this.isValidProduct(item)));

        return true;
    }

    async getTotalAmount(list: CreateOrderProductItemDto[]) {
        const snapShotList = await Promise.all(
            list.map(item => this.getProductSnapshot(item.productId, item.productTypeId)),
        );

        const sum = list.reduce((acc, item) => {
            const [product, productType] = snapShotList.find(([p, pt]) => {
                const sameProduct = p.id === item.productId;
                if (item.productTypeId) {
                    return sameProduct && pt.id === item.productTypeId;
                }
                return sameProduct;
            });
            let unitPrice = product.price;
            if (productType) {
                unitPrice = productType.price;
            }

            return (acc += unitPrice * item.quantity);
        }, 0);

        return sum;
    }

    async getProductByOrder(orderId: string) {
        const list = await this.orderProductItemRepository.find({ where: { orderId }, loadEagerRelations: false });

        return list;
    }

    async updateProductQuantity(item: CreateOrderProductItemDto) {
        const { productId, quantity, productTypeId } = item;
        if (productTypeId) {
            const productType = await this.productTypesRepository.findOne({
                where: { id: productTypeId },
                loadEagerRelations: false,
            });

            return this.productTypesRepository.save({ ...productType, quantity: productType.quantity - quantity });
        }
        const product = await this.productBaseRepository.findOne({
            where: { id: productId },
            loadEagerRelations: false,
        });

        return this.productBaseRepository.save({ ...product, quantity: product.quantity - quantity });
    }

    async create(orderId: string, list: CreateOrderProductItemDto[]) {
        const snapShotList = await Promise.all(
            list.map(item => this.getProductSnapshot(item.productId, item.productTypeId)),
        );

        const savedList = await this.orderProductItemRepository.save(
            list.map(item => {
                const [product, productType] = snapShotList.find(([p, pt]) => {
                    const sameProduct = p.id === item.productId;
                    if (item.productTypeId) {
                        return sameProduct && pt.id === item.productTypeId;
                    }
                    return sameProduct;
                });
                let unitPrice = product.price;
                if (productType) {
                    unitPrice = productType.price;
                }

                return this.orderProductItemRepository.create({
                    ...item,
                    productSnapshot: product,
                    productTypeSnapshot: productType,
                    unitPrice,
                    totalPrice: unitPrice * item.quantity,
                    orderId,
                });
            }),
        );

        const updateQuantity = await Promise.all(list.map(item => this.updateProductQuantity(item)));

        return savedList;
    }
}
