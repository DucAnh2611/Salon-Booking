import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { multerConfig } from '../../config/multer.configs';
import { BadRequest } from '../../shared/exception/error.exception';
import { MediaEntity } from '../media/entity/media.entity';
import { MediaService } from '../media/service/media.service';
import { ServiceBaseService } from '../service-base/service-base.service';
import { BodyCreateServiceStepDto, CreateSeviceStepDto } from './dto/service-step-create.dto';
import { BodyUpdateServiceStepDto, UpdateSeviceStepDto } from './dto/service-step-update-dto';
import { ServiceStepEntity } from './entity/service-step.entity.entity';

@Injectable()
export class ServiceStepService {
    constructor(
        @InjectRepository(ServiceStepEntity) private readonly serviceStepRepository: Repository<ServiceStepEntity>,
        private readonly serviceBaseService: ServiceBaseService,
        private readonly mediaService: MediaService,
    ) {}

    isExist(id: string) {
        return this.serviceStepRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    listByServiceId(serviceId: string) {
        return this.serviceStepRepository.find({ where: { serviceId }, loadEagerRelations: false });
    }

    getStepDetailService(serviceId: string) {
        return this.serviceStepRepository.find({
            where: { serviceId },
            loadEagerRelations: false,
            relations: {
                thumbnail: true,
            },
            order: { step: SortByEnum.DESC },
        });
    }

    isDistinctStepLevel<T extends CreateSeviceStepDto>(list: T[]) {
        const listLevel = list.map(item => item.step);
        const set = new Set(listLevel);
        return Array.from(set).length === listLevel.length;
    }

    sortList<T extends CreateSeviceStepDto>(list: T[]) {
        if (list.length === 0) return [];
        let currIndex = 1;
        const sortedList = list.sort((a, b) => a.step - b.step);

        if (sortedList.at(sortedList.length - 1).step === list.length) {
            return sortedList;
        }

        return sortedList.map(item => {
            if (currIndex !== item.step) {
                item.step = currIndex;
            }
            currIndex++;
            return item;
        });
    }

    async prepareThumbnail(userId: string, serviceId: string, id?: string, url?: string) {
        if (id) {
            const isExist = await this.mediaService.isValid(id);
            if (!isExist) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_MEDIA });
            }
            return isExist;
        } else if (url) {
            const getFile = await this.mediaService.getMediaFromPath(url);
            if (!getFile) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_MEDIA });
            }

            const saveThumbnail = await this.mediaService.save(
                userId,
                getFile.file,
                `${multerConfig.service}/${serviceId}/steps`,
            );
            return saveThumbnail;
        }

        return null;
    }

    async saveMany(userId: string, employeeId: string, body: BodyCreateServiceStepDto) {
        const { serviceId, steps } = body;

        const isValid = await this.serviceBaseService.isValid(serviceId);
        if (!isValid) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE });
        }

        const isDistinct = this.isDistinctStepLevel(steps);
        if (!isDistinct) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_SERVICE_STEP_LEVEL });
        }

        const saved = await Promise.all(
            this.sortList(steps).map(step => this.save(userId, employeeId, serviceId, step)),
        );

        return saved;
    }

    async save(userId: string, employeeId: string, serviceId: string, step: CreateSeviceStepDto) {
        const { name, description, thumbnailId, thumbnailUrl, step: stepLevel } = step;

        let thumbnail: MediaEntity | null = null;
        if (thumbnailId || thumbnailUrl) {
            thumbnail = await this.prepareThumbnail(userId, serviceId, thumbnailId, thumbnailUrl);
        }

        const instances = this.serviceStepRepository.create({
            name,
            description,
            step: stepLevel,
            thumbnailId: thumbnail?.id,
            serviceId,
            createdBy: employeeId,
            updatedBy: employeeId,
        });

        return this.serviceStepRepository.save(instances);
    }

    async updateMany(userId: string, employeeId: string, body: BodyUpdateServiceStepDto) {
        const { serviceId, steps } = body;

        const isValid = await this.serviceBaseService.isValid(serviceId);
        if (!isValid) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE });
        }
        const listByServiceId = await this.listByServiceId(serviceId);
        const deleteList = listByServiceId.filter(item => !steps.find(step => step.id === item.id));

        const deletedList = await this.serviceStepRepository.delete({
            id: In(deleteList.map(item => item.id)),
        });

        const isDistinct = this.isDistinctStepLevel(steps);
        if (!isDistinct) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_SERVICE_STEP_LEVEL });
        }

        const saved = await Promise.all(
            this.sortList(steps).map(step => this.update(userId, employeeId, serviceId, step)),
        );

        return saved;
    }

    async update(userId: string, employeeId: string, serviceId: string, step: UpdateSeviceStepDto) {
        const { id, thumbnailId, thumbnailUrl, ...props } = step;

        if (id) {
            const isExist = await this.isExist(id);

            if (!isExist) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE_STEP });
            }

            const newInstance = this.serviceStepRepository.create({
                ...isExist,
                ...props,
                updatedBy: employeeId,
            });

            if (thumbnailId || thumbnailUrl) {
                const thumbnail = await this.prepareThumbnail(userId, serviceId, thumbnailId, thumbnailUrl);
                newInstance.thumbnailId = thumbnail.id;
            } else {
                newInstance.thumbnailId = null;
            }

            return await this.serviceStepRepository.save(newInstance);
        } else {
            const newIns: CreateSeviceStepDto = { thumbnailId, thumbnailUrl, ...props };

            return await this.save(userId, employeeId, serviceId, newIns);
        }
    }
}
