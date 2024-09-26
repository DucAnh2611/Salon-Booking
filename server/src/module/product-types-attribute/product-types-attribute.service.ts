import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { multerConfig } from '../../config/multer.configs';
import { BadRequest } from '../../shared/exception/error.exception';
import { AttributeService } from '../attribute/attribute.service';
import { MediaService } from '../media/service/media.service';
import { CreateProductTypesAttributeDto } from './dto/product-types-attribute-create.dto';
import { UpdateProductTypesAttributeDto } from './dto/product-types-attribute-update.dto';
import { ProductTypesAttributeEntity } from './entity/product-types-attribute.entity';

@Injectable()
export class ProductTypesAttributeService {
    constructor(
        @InjectRepository(ProductTypesAttributeEntity)
        private readonly productTypesAttributeRepository: Repository<ProductTypesAttributeEntity>,
        private readonly attributeService: AttributeService,
        private readonly mediaService: MediaService,
    ) {}

    getAttributeDetailForType(productTypesId: string) {
        return this.productTypesAttributeRepository.find({
            where: { productTypesId },
            loadEagerRelations: false,
            relations: {
                thumbnail: true,
                value: {
                    attribute: true,
                },
            },
            order: {
                level: SortByEnum.ASC,
            },
        });
    }

    async getThumbnailId(userId: string, productId: string, typeId: string, mediaId?: string, mediaUrl?: string) {
        if (mediaId) {
            const validMedia = await this.mediaService.isValid(mediaId);
            if (!validMedia) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_MEDIA });
            }
            return validMedia.id;
        }
        if (mediaUrl) {
            const getFile = await this.mediaService.getMediaFromPath(mediaUrl);
            if (!getFile) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_MEDIA });
            }
            const saveMedia = await this.mediaService.save(
                userId,
                getFile.file,
                `${multerConfig.product.base}/${productId}/${multerConfig.product.typesAttribute}`,
            );
            return saveMedia.id;
        }
        return null;
    }

    async isValid(productTypesId: string) {
        const [productTypeAttr] = await Promise.all([
            this.productTypesAttributeRepository.findOne({
                where: { productTypesId },
                loadEagerRelations: false,
            }),
        ]);
        return productTypeAttr;
    }

    async isExist(productTypesId: string) {
        const exist = await this.productTypesAttributeRepository.findOne({
            where: { productTypesId },
            loadEagerRelations: false,
        });
        if (!exist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST });
        }
        return exist;
    }

    async isExistTypeAttribute(productTypesId: string, valueId: string, level: number) {
        const exist = await this.productTypesAttributeRepository.findOne({
            where: { productTypesId, attributeValueId: valueId, level },
            loadEagerRelations: false,
        });
        return exist;
    }

    async saveMany(userId: string, productId: string, attribute: CreateProductTypesAttributeDto[]) {
        return Promise.all(attribute.map(attr => this.save(userId, productId, attr)));
    }

    async save(userId: string, productId: string, attribute: CreateProductTypesAttributeDto) {
        const { productTypesId, mediaId, mediaUrl, valueId, level } = attribute;
        await this.isValid(productTypesId);

        const thumbnailId = await this.getThumbnailId(userId, productId, productTypesId, mediaId, mediaUrl);
        const instance = this.productTypesAttributeRepository.create({
            attributeValueId: valueId,
            productTypesId: productTypesId,
            thumbnailId: thumbnailId,
            level,
        });
        const saved = await this.productTypesAttributeRepository.save(instance);
        return saved;
    }

    async updateMany(userId: string, productId: string, attribute: UpdateProductTypesAttributeDto[]) {
        if (!attribute.length) return [];

        await this.deleteBeforeInsert(attribute.at(0).productTypesId);
        const updated = await Promise.all(attribute.map(attr => this.update(userId, productId, attr)));
        return updated;
    }

    async update(userId: string, productId: string, updateAttr: UpdateProductTypesAttributeDto) {
        const { mediaId, mediaUrl, productTypesId, valueId, level } = updateAttr;

        await this.isValid(productTypesId);

        const thumbnailId = await this.getThumbnailId(userId, productId, productTypesId, mediaId, mediaUrl);

        const exist = await this.isExistTypeAttribute(productTypesId, valueId, level);
        if (!exist) {
            return this.save(userId, productId, { level, productTypesId, valueId, mediaId, mediaUrl });
        }

        await this.productTypesAttributeRepository.update(
            { productTypesId },
            { attributeValueId: valueId, level: level, thumbnailId: thumbnailId || exist.thumbnailId },
        );

        return DataSuccessCodeEnum.OK;
    }

    async deleteBeforeInsert(productTypesId: string) {
        await this.productTypesAttributeRepository.delete({
            productTypesId,
        });
    }

    async deleteOne(productTypesId: string) {
        const exist = await this.isExist(productTypesId);

        await this.productTypesAttributeRepository.delete({ productTypesId });

        return DataSuccessCodeEnum.OK;
    }
}
