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
                attribute: true,
            },
            order: {
                level: SortByEnum.ASC,
            },
        });
    }

    async getThumbnailId(
        userId: string,
        productId: string,
        typeId: string,
        attrId: string,
        mediaId?: string,
        mediaUrl?: string,
    ) {
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

    async isValid(productTypesId: string, attrId: string) {
        const [validAttr, productTypeAttr] = await Promise.all([
            this.attributeService.isValid(attrId),
            this.productTypesAttributeRepository.findOne({
                where: { productTypesId, attributeId: attrId },
                loadEagerRelations: false,
            }),
        ]);
        if (!validAttr) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ATTRIBUTE });
        }
        return { validAttr, productTypeAttr };
    }

    async isExist(productTypesId: string, attrId: string) {
        const exist = await this.productTypesAttributeRepository.findOne({
            where: { productTypesId, attributeId: attrId },
            loadEagerRelations: false,
        });
        if (!exist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST });
        }
        return exist;
    }

    async saveMany(userId: string, productId: string, attribute: CreateProductTypesAttributeDto[]) {
        return Promise.all(attribute.map(attr => this.save(userId, productId, attr)));
    }

    async save(userId: string, productId: string, attribute: CreateProductTypesAttributeDto) {
        const { attrId, productTypesId, mediaId, mediaUrl, value, level } = attribute;

        await this.isValid(productTypesId, attrId);

        const thumbnailId = await this.getThumbnailId(userId, productId, productTypesId, attrId, mediaId, mediaUrl);

        const instance = this.productTypesAttributeRepository.create({
            attributeId: attrId,
            productTypesId: productTypesId,
            thumbnailId: thumbnailId,
            value,
            level,
        });

        const saved = await this.productTypesAttributeRepository.save(instance);

        return saved;
    }

    async updateMany(userId: string, productId: string, attribute: UpdateProductTypesAttributeDto[]) {
        return Promise.all(attribute.map(attr => this.update(userId, productId, attr)));
    }

    async update(userId: string, productId: string, updateAttr: UpdateProductTypesAttributeDto) {
        const { attrId, mediaId, mediaUrl, productTypesId, value } = updateAttr;

        await this.isValid(productTypesId, attrId);

        const thumbnailId = await this.getThumbnailId(userId, productId, productTypesId, attrId, mediaId, mediaUrl);

        const exist = await this.isExist(productTypesId, attrId);

        const newProductTypesAttr: ProductTypesAttributeEntity = {
            ...exist,
            thumbnailId: thumbnailId || exist.thumbnailId,
            value: value || exist.value,
        };

        return this.productTypesAttributeRepository.update(
            { productTypesId, attributeId: attrId },
            newProductTypesAttr,
        );
    }

    async deleteOne(productTypesId: string, attributeId: string) {
        const exist = await this.isExist(productTypesId, attributeId);

        await this.productTypesAttributeRepository.delete({ productTypesId, attributeId });

        return DataSuccessCodeEnum.OK;
    }
}
