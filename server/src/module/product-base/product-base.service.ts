import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { multerConfig } from '../../config/multer.configs';
import { BadRequest } from '../../shared/exception/error.exception';
import { CategoryService } from '../category/category.service';
import { MediaService } from '../media/media.service';
import { CreateProductMediaDto } from '../product-media/dto/product-media-create.dto';
import { ProductMediaService } from '../product-media/product-media.service';
import { ProductTypesEntity } from '../product-types/entity/product-types.entity';
import { CreateProductBaseDto } from './dto/product-base-create.dto';
import { ProductBaseMediaIdDto, ProductBaseMediaURLDto } from './dto/product-base-media.dto';
import { UpdateProductBaseDto } from './dto/product-base-update.dto';
import { ProductBaseEntity } from './entity/product-base.entity';

@Injectable()
export class ProductBaseService {
    constructor(
        @InjectRepository(ProductBaseEntity) private readonly productBaseRepository: Repository<ProductBaseEntity>,
        @InjectRepository(ProductTypesEntity) private readonly productTypesRepository: Repository<ProductTypesEntity>,
        private readonly categoryService: CategoryService,
        private readonly mediaService: MediaService,
        private readonly productMediaService: ProductMediaService,
    ) {}
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
            mutipleMedia = await this.insertMediaWithIds(thumbnailIds, productId);
        } else if (thumbnailUrls && thumbnailUrls.length) {
            mutipleMedia = await this.insertMediaWithUrls(thumbnailUrls, productId, userId);
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
        });

        if (categoryId) {
            const validCategory = await this.categoryService.isExist(categoryId, 'id');
            if (!validCategory) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_CATEGORY });
            }
            productInstance.categoryId = categoryId;
        }

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

            const [deleteBeforeInsert, saveMediaProduct] = await Promise.all([
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
}
