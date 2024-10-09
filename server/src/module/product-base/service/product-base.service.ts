import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { count } from 'console';
import { Between, ILike, In, Like, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../../common/enum/data-success-code.enum';
import { SortByEnum } from '../../../common/enum/query.enum';
import { multerConfig } from '../../../config/multer.configs';
import { BadRequest } from '../../../shared/exception/error.exception';
import { ParseOrderString } from '../../../shared/utils/parse-dynamic-queyry.utils';
import { CategoryService } from '../../category/category.service';
import { MediaService } from '../../media/service/media.service';
import { OrderProductItemEntity } from '../../order-product-item/entity/order-product-item.entity';
import { CreateProductMediaDto } from '../../product-media/dto/product-media-create.dto';
import { ProductMediaService } from '../../product-media/product-media.service';
import { ProductTypesEntity } from '../../product-types/entity/product-types.entity';
import { CreateProductBaseDto } from '../dto/product-base-create.dto';
import { DeleteProductBaseDto } from '../dto/product-base-delete.dto';
import { FindProductBaseAdminDto, FindProductBaseDto } from '../dto/product-base-get.dto';
import { ProductBaseMediaIdDto, ProductBaseMediaURLDto } from '../dto/product-base-media.dto';
import { UpdateProductBaseDto } from '../dto/product-base-update.dto';
import { ProductBaseEntity } from '../entity/product-base.entity';

@Injectable()
export class ProductBaseService {
    constructor(
        @InjectRepository(ProductBaseEntity) private readonly productBaseRepository: Repository<ProductBaseEntity>,
        @InjectRepository(ProductTypesEntity) private readonly productTypesRepository: Repository<ProductTypesEntity>,
        @InjectRepository(OrderProductItemEntity)
        private readonly orderProductItemRepository: Repository<OrderProductItemEntity>,
        private readonly categoryService: CategoryService,
        private readonly mediaService: MediaService,
        private readonly productMediaService: ProductMediaService,
    ) {}

    async existSku(skus: string[]) {
        const count = await this.productBaseRepository.count({
            where: [{ sku: In(skus) }, { types: { sku: In(skus) } }],
            loadEagerRelations: false,
        });

        if (count) {
            throw new BadRequest({ message: DataErrorCodeEnum.EXISTED_SKU });
        }
    }

    async existSkuNotId(skus: Array<{ productId?: string; sku: string; productTypeId?: string }>) {
        const counts = await Promise.all(
            skus.map(async skuItem => {
                const { productId, sku, productTypeId } = skuItem;
                let count = 0;
                if (productId) {
                    count = await this.productBaseRepository.count({
                        where: [
                            {
                                id: Not(productId),
                                sku: sku,
                            },
                            {
                                types: { sku },
                            },
                        ],
                        loadEagerRelations: false,
                    });
                } else if (productTypeId) {
                    count = await this.productBaseRepository.count({
                        where: [
                            {
                                sku: sku,
                            },
                            {
                                types: {
                                    id: Not(productTypeId),
                                    sku,
                                },
                            },
                        ],
                        loadEagerRelations: false,
                    });
                } else {
                    count = await this.productBaseRepository.count({
                        where: [
                            {
                                sku: sku,
                            },
                            {
                                types: {
                                    sku,
                                },
                            },
                        ],
                        loadEagerRelations: false,
                    });
                }

                return count;
            }),
        );
        if (counts.filter(i => !i).length !== count.length) {
            throw new BadRequest({ message: DataErrorCodeEnum.EXISTED_SKU });
        }
    }

    async detail(id: string) {
        const product = await this.productBaseRepository.findOne({
            where: { id },
            loadEagerRelations: false,
            relations: {
                userCreate: {
                    userBase: {
                        userAvatar: true,
                    },
                    eRole: true,
                },
                userUpdate: {
                    userBase: {
                        userAvatar: true,
                    },
                    eRole: true,
                },
                category: true,
            },
        });

        if (!product) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT });
        }

        const media = await this.productMediaService.getListDetailForProduct(id);

        return {
            ...product,
            media,
        };
    }

    async findAdmin(query: FindProductBaseAdminDto) {
        const { key, limit, page, orderBy } = query;

        const order = orderBy ? ParseOrderString(orderBy) : { createdAt: SortByEnum.ASC };

        const [items, count] = await this.productBaseRepository.findAndCount({
            where: [
                { name: Like(`%${key}%`) },
                { sku: Like(`%${key}%`) },
                {
                    types: {
                        sku: Like(`%${key}%`),
                    },
                },
            ],
            loadEagerRelations: false,
            relations: {
                types: true,
            },
            order: { ...order },
            skip: (page - 1) * limit,
            take: limit,
        });

        const mapMedia = await Promise.all(
            items.map(async item => {
                const media = await this.productMediaService.getListDetailForProduct(item.id);
                return {
                    ...item,
                    productMedia: media,
                };
            }),
        );
        return {
            items: mapMedia,
            count,
            limit,
            page,
        };
    }

    async find(query: FindProductBaseDto) {
        const { key = '', limit, page, orderBy, price, categoryIds } = query;

        let orderSpilit = ['createdAt', SortByEnum.ASC];

        if (orderBy && orderBy.includes(':')) {
            orderSpilit = orderBy.split(':');
        }

        const [field, sort] = orderSpilit;

        const [items, count] = await this.productBaseRepository.findAndCount({
            where: {
                name: ILike(`%${key}%`),
                price: price.to ? Between(price.from, price.to) : MoreThanOrEqual(price.from),
                ...(categoryIds.length ? { categoryId: In(categoryIds) } : {}),
            },
            loadEagerRelations: false,
            order: { [field]: sort },
            relations: {
                types: true,
            },
            skip: (page - 1) * limit,
            take: limit,
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
        return {
            items: mapMedia,
            count,
            limit,
            page,
        };
    }

    isValid(id: string) {
        return this.productBaseRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    async insertMediaWithIds(thumbnailIds: ProductBaseMediaIdDto[], productId: string) {
        const mutipleMedia = await Promise.all(
            thumbnailIds.map(async (thumbnail: ProductBaseMediaIdDto) => {
                const checkExist = await this.mediaService.isValid(thumbnail.id);
                if (!checkExist) {
                    throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_MEDIA });
                }
                return {
                    isThumbnail: thumbnail.isThumbnail,
                    mediaId: thumbnail.id,
                    productId,
                };
            }),
        );

        await this.productMediaService.deleteIdsNotInList(
            thumbnailIds.map(id => id.id),
            productId,
        );

        return mutipleMedia;
    }

    async insertMediaWithUrls(thumbnailUrls: ProductBaseMediaURLDto[], productId: string, userId: string) {
        const validTempMedias = await Promise.all(
            thumbnailUrls.map(async (thumbnail: ProductBaseMediaURLDto) => {
                const media = await this.mediaService.getMediaFromPath(thumbnail.url);
                if (!media) {
                    throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_MEDIA });
                }
                return {
                    isThumbnail: thumbnail.isThumbnail,
                    productId,
                    file: media.file,
                };
            }),
        );

        const mutipleMedia = await Promise.all(
            validTempMedias.map(async media => {
                const { isThumbnail, productId } = media;
                const savedMedia = await this.mediaService.save(
                    userId,
                    media.file,
                    `${multerConfig.product.base}/${productId}`,
                );

                return {
                    mediaId: savedMedia.id,
                    productId,
                    isThumbnail,
                };
            }),
        );

        return mutipleMedia;
    }

    /**
     * The function `attachMedia` asynchronously attaches media to a product using either IDs or URLs.
     * @param {string} productId - The `productId` parameter is a string that represents the unique product
     * @param {ProductBaseMediaIdDto[]} thumbnailIds - The IDs of the thumbnails to be attached to the product.
     * @param {ProductBaseMediaURLDto[]} thumbnailUrls - Each object in the array represents a thumbnail URL for a product media.
     * These URLs are used to insert media for a product. URL accepted is provide by response of api: `/media/temp-upload`
     * @description if both IDs and URLs is provider, IDs have more piority
     * @returns The `saveMediaProduct` variable is being returned from the `attachMedia` function.
     */
    async attachMedia(
        productId: string,
        userId: string,
        thumbnailIds?: ProductBaseMediaIdDto[],
        thumbnailUrls?: ProductBaseMediaURLDto[],
    ) {
        let mutipleMedia: CreateProductMediaDto[] = [];
        if (thumbnailIds && thumbnailIds.length) {
            const insertMediaId = await this.insertMediaWithIds(thumbnailIds, productId);
            mutipleMedia = [...mutipleMedia, ...insertMediaId];
        }
        if (thumbnailUrls && thumbnailUrls.length) {
            const insertMediaUrl = await this.insertMediaWithUrls(thumbnailUrls, productId, userId);
            mutipleMedia = [...mutipleMedia, ...insertMediaUrl];
        }

        const saveMediaProduct = await this.productMediaService.saveMany(mutipleMedia);
        return saveMediaProduct;
    }

    async findBySku(sku: string) {
        const [findBase, findTypes] = await Promise.all([
            this.productBaseRepository.findOne({ where: { sku }, loadEagerRelations: false }),
            this.productTypesRepository.findOne({ where: { sku }, loadEagerRelations: false }),
        ]);
        return [findBase, findTypes];
    }

    async save(userId: string, employeeId: string, productBase: CreateProductBaseDto) {
        const { thumbnailUrls, thumbnailIds, ...props } = productBase;
        const { categoryId } = props;

        const validCategory = await this.categoryService.isExist(categoryId, 'id');
        if (!validCategory) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_CATEGORY });
        }

        if (!thumbnailIds && !thumbnailUrls) {
            throw new BadRequest({ message: DataErrorCodeEnum.MISSING_THUMBNAIL });
        }

        if (props.sku) {
            const [base, type] = await this.findBySku(props.sku);
            if (base || type) {
                throw new BadRequest({ message: DataErrorCodeEnum.SAME_SKU });
            }
        }

        const productInstance = this.productBaseRepository.create({
            ...props,
            createdBy: employeeId,
            updatedBy: employeeId,
        });

        const saved = await this.productBaseRepository.save(productInstance);

        const saveMediaProduct = await this.attachMedia(saved.id, userId, thumbnailIds, thumbnailUrls);

        return saved;
    }

    async update(userId: string, employeeId: string, productBaseId: string, productBase: UpdateProductBaseDto) {
        const { categoryId, thumbnailUrls, thumbnailIds } = productBase;
        const isExist = await this.isValid(productBaseId);
        if (!isExist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT });
        }

        const productInstance = this.productBaseRepository.create({
            ...isExist,
            brand: productBase.brand || isExist.brand,
            name: productBase.name || isExist.name,
            description: productBase.description || isExist.description,
            price: productBase.price || isExist.price,
            quantity: productBase.quantity || isExist.quantity,
            updatedBy: employeeId,
            updatedAt: new Date(),
        });

        if (categoryId) {
            const validCategory = await this.categoryService.isExist(categoryId, 'id');
            if (!validCategory) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_CATEGORY });
            }
            productInstance.categoryId = categoryId;
        }

        console.warn(thumbnailIds, thumbnailUrls);

        if (thumbnailIds || thumbnailUrls) {
            const productMedias = await this.productMediaService.getListByProductId(productBaseId);
            let listDeleteMedias = productMedias.map(media => media.mediaId);

            if (thumbnailIds) {
                listDeleteMedias = thumbnailIds.reduce((acc, curr) => {
                    if (!productMedias.find(media => media.mediaId === curr.id)) {
                        acc.push(curr.id);
                    }
                    return acc;
                }, []);
            }

            const [_deleteBeforeInsert, _saveMediaProduct] = await Promise.all([
                this.productMediaService.deleteMany(productBaseId, listDeleteMedias),
                this.attachMedia(productBaseId, userId, thumbnailIds, thumbnailUrls),
            ]);
        }

        return this.productBaseRepository.save(productInstance);
    }

    async archive(employeeId: string, productBaseId: string) {
        const isExist = await this.isValid(productBaseId);

        if (!isExist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT });
        }

        const archive = await this.productBaseRepository.softDelete({ id: productBaseId });

        return DataSuccessCodeEnum.OK;
    }

    async deleteMany(body: DeleteProductBaseDto) {
        const { ids } = body;

        const deleted = await this.productBaseRepository.softDelete({ id: In(ids) });

        return DataSuccessCodeEnum.OK;
    }
}
