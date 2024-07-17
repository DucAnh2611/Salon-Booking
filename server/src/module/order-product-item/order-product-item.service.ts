import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { ProductBaseEntity } from '../product-base/entity/product-base.entity';
import { ProductTypesEntity } from '../product-types/entity/product-types.entity';
import { CreateOrderProductItemDto } from './dto/order-product-item-create.module';
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
    ) {}

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
            this.productTypesRepository.findOne({ where: { id: productTypeId }, loadEagerRelations: false }),
        ]);

        return [product, productType];
    }

    async checkValidListProduct(list: CreateOrderProductItemDto[]) {
        if (!list.length) {
            throw new BadRequest({ message: DataErrorCodeEnum.NO_ORDER_ITEM });
        }
        await Promise.all(
            list.map(({ productId, productTypeId }: CreateOrderProductItemDto) =>
                this.isValidProduct(productId, productTypeId),
            ),
        );

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

    async create(orderId: string, list: CreateOrderProductItemDto[]) {
        await this.checkValidListProduct(list);

        const snapShotList = await Promise.all(
            list.map(item => this.getProductSnapshot(item.productId, item.productTypeId)),
        );

        return this.orderProductItemRepository.save(
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
                    orderId,
                });
            }),
        );
    }
}
