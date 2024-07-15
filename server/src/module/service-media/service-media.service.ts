import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { multerConfig } from '../../config/multer.configs';
import { BadRequest } from '../../shared/exception/error.exception';
import { MediaService } from '../media/media.service';
import { BodyCreateServiceMediaDto, ServiceMediaDto } from './dto/service-media-create.dto';
import { BodyUpdateServiceMediaDto } from './dto/service-media-update.dto';
import { ServiceMediaEntity } from './entity/service-media.entity';

@Injectable()
export class ServiceMediaService {
    constructor(
        @InjectRepository(ServiceMediaEntity) private readonly serviceMediaRepository: Repository<ServiceMediaEntity>,
        private readonly mediaService: MediaService,
    ) {}

    listByServiceId(serviceId: string) {
        return this.serviceMediaRepository.find({ where: { serviceId }, loadEagerRelations: false });
    }

    async prepareMedia(userId: string, employeeId: string, serviceId: string, id?: string, url?: string) {
        if (id) {
            const isExist = await this.mediaService.isValid(id);
            if (!isExist) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_MEDIA });
            }
            return isExist;
        }
        if (url) {
            const getMedia = await this.mediaService.getMediaFromPath(url);
            if (!getMedia) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_MEDIA });
            }

            const saveMedia = await this.mediaService.save(
                userId,
                getMedia.file,
                `${multerConfig.service}/${serviceId}`,
            );

            return saveMedia;
        }

        return null;
    }

    async saveMany(userId: string, employeeId: string, body: BodyCreateServiceMediaDto) {
        const { medias, serviceId } = body;

        if (!medias.find(item => item.isThumbnail)) {
            medias[0].isThumbnail = true;
        }

        const save = await Promise.all(medias.map(media => this.save(userId, employeeId, serviceId, media)));
        return save;
    }

    async save(userId: string, employeeId: string, serviceId: string, media: ServiceMediaDto) {
        const { isThumbnail, mediaId, mediaUrl } = media;

        const preparedMedia = await this.prepareMedia(userId, employeeId, serviceId, mediaId, mediaUrl);
        if (!preparedMedia) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_MEDIA });
        }

        const instance = this.serviceMediaRepository.create({
            isThumbnail,
            serviceId,
            mediaId: preparedMedia.id,
        });

        return this.serviceMediaRepository.save(instance);
    }

    async updateMany(userId: string, employeeId: string, body: BodyUpdateServiceMediaDto) {
        const { medias, serviceId } = body;

        if (!medias.find(item => item.isThumbnail)) {
            medias[0].isThumbnail = true;
        }

        const listByServiceId = await this.listByServiceId(serviceId);

        const deleteList = await this.serviceMediaRepository.delete({
            serviceId,
            mediaId: In(
                listByServiceId
                    .filter(item => !medias.find(media => media.mediaId === item.mediaId))
                    .map(i => i.mediaId),
            ),
        });

        const save = await Promise.all(medias.map(media => this.update(userId, employeeId, serviceId, media)));
        return save;
    }

    async update(userId: string, employeeId: string, serviceId: string, media: ServiceMediaDto) {
        const { isThumbnail, mediaId, mediaUrl } = media;

        const preparedMedia = await this.prepareMedia(userId, employeeId, serviceId, mediaId, mediaUrl);

        const instance = this.serviceMediaRepository.create({
            mediaId: preparedMedia.id,
            serviceId,
            isThumbnail,
        });

        return this.serviceMediaRepository.save(instance);
    }
}
