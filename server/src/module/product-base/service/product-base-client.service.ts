import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../../common/enum/data-error-code.enum';
import { SortByEnum } from '../../../common/enum/query.enum';
import { BadRequest } from '../../../shared/exception/error.exception';
import { CategoryService } from '../../category/category.service';
import { OrderProductItemEntity } from '../../order-product-item/entity/order-product-item.entity';
import { ProductMediaService } from '../../product-media/product-media.service';
import { ProductTypesEntity } from '../../product-types/entity/product-types.entity';
import { ProductBaseEntity } from '../entity/product-base.entity';

@Injectable()
export class ProductBaseClientService {
    constructor(
        @InjectRepository(OrderProductItemEntity)
        private readonly orderProductItemRepository: Repository<OrderProductItemEntity>,
        @InjectRepository(ProductBaseEntity) private readonly productBaseRepository: Repository<ProductBaseEntity>,
        @InjectRepository(ProductTypesEntity) private readonly productTypesRepository: Repository<ProductTypesEntity>,
        private readonly categoryService: CategoryService,
        private readonly productMediaService: ProductMediaService,
    ) {}

    isValid(id: string) {
        return this.productBaseRepository.findOne({ where: { id }, loadEagerRelations: false });
    }
    async featured() {
        const items = await this.productBaseRepository.find({
            where: {},
            loadEagerRelations: false,
            take: 4,
            skip: 0,
            order: { createdAt: SortByEnum.DESC },
            relations: {
                types: true,
                productMedia: {
                    media: true,
                },
            },
        });

        const mapMedia = await Promise.all(
            items.map(async item => {
                const media = await this.productMediaService.getListDetailForProduct(item.id);
                const buyingCounts = await this.orderProductItemRepository.sum('quantity', { productId: item.id });

                return {
                    ...item,
                    productMedia: media,
                    buyingCounts,
                };
            }),
        );

        return mapMedia;
    }

    async inStock(id: string) {
        const product = await this.isValid(id);

        if (!product) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT });
        }

        return { quantity: product.quantity };
    }

    async relatedProduct(relatedCategoryIds: string[], productId?: string) {
        const related = await this.productBaseRepository.find({
            where: {
                ...(productId ? { id: Not(productId) } : {}),
                ...(relatedCategoryIds.length ? { categoryId: In(relatedCategoryIds) } : {}),
            },
            loadEagerRelations: false,
            relations: {
                types: true,
                productMedia: {
                    media: true,
                },
            },
            take: 10,
            skip: 0,
        });

        const mapMedia = await Promise.all(
            related.map(async item => {
                const media = await this.productMediaService.getListDetailForProduct(item.id);
                const buyingCounts = await this.orderProductItemRepository.sum('quantity', { productId: item.id });

                return {
                    ...item,
                    productMedia: media,
                    buyingCounts,
                };
            }),
        );

        return mapMedia;
    }

    async detail(id: string) {
        const productBase = await this.productBaseRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                category: {
                    image: true,
                },
                productDetail: true,
                productMedia: {
                    media: true,
                },
                types: {
                    productTypesAttribute: {
                        thumbnail: true,
                        value: true,
                    },
                },
            },
            loadEagerRelations: false,
        });

        return productBase;
    }
}
