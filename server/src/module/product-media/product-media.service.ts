import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest, InternalServer } from '../../shared/exception/error.exception';
import { MediaService } from '../media/media.service';
import { CreateProductMediaDto } from './dto/product-media-create.dto';
import { ProductMediaEntity } from './entity/product-media.entity';

@Injectable()
export class ProductMediaService {
    constructor(
        @InjectRepository(ProductMediaEntity) private readonly productMediaRepository: Repository<ProductMediaEntity>,
        private readonly mediaService: MediaService,
    ) {}

    async getListByProductId(id: string) {
        return this.productMediaRepository.findBy({ productId: id });
    }

    getListDetailForProduct(productId: string) {
        return this.productMediaRepository.find({
            where: { productId },
            loadEagerRelations: false,
            relations: {
                media: true,
            },
        });
    }

    async saveMany(medias: CreateProductMediaDto[]) {
        if (!medias.length) {
            return [];
        }

        if (medias.filter(media => media.isThumbnail).length === 0) {
            medias[0].isThumbnail = true;
        }

        const saves = await Promise.all(medias.map(media => this.save(media)));
        return saves;
    }

    async save(media: CreateProductMediaDto) {
        const { isThumbnail, mediaId, productId } = media;
        const [validMedia] = await Promise.all([this.mediaService.isValid(mediaId)]);

        if (!validMedia) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_MEDIA });
        }
        const mediaInstance = this.productMediaRepository.create({
            mediaId,
            productId,
            isThumbnail,
        });

        const saveMedia = await this.productMediaRepository.save(mediaInstance);

        return saveMedia;
    }

    async setThumbnail(employeeId: string, productId: string, mediaId: string) {
        const listMedia = await this.getListByProductId(productId);
        const newListMedia = listMedia.map(media => {
            if (media.mediaId === mediaId) {
                media.isThumbnail = true;
            } else if (media.isThumbnail) {
                media.isThumbnail = false;
            }

            return media;
        });

        await this.productMediaRepository.save(newListMedia);

        return newListMedia.find(media => mediaId === media.mediaId);
    }

    async delete(productId: string, mediaId: string) {
        const deletedMedia = await this.productMediaRepository.delete({ productId, mediaId });

        if (!deletedMedia) {
            throw new InternalServer();
        }

        return DataSuccessCodeEnum.OK;
    }

    async deleteMany(productId, mediaIds: string[]) {
        const deletedMedia = await this.productMediaRepository.delete({ productId, mediaId: In(mediaIds) });

        if (!deletedMedia) {
            throw new InternalServer();
        }

        return DataSuccessCodeEnum.OK;
    }
}
