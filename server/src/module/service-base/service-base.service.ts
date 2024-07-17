import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { CategoryService } from '../category/category.service';
import { ServiceMediaService } from '../service-media/service-media.service';
import { CreateServiceBaseDto } from './dto/service-base-create.dto';
import { UpdateServiceBaseDto } from './dto/service-base-update.dto';
import { ServiceEntity } from './entity/service.entity';

@Injectable()
export class ServiceBaseService {
    constructor(
        @InjectRepository(ServiceEntity) private readonly seriviceBaseRepository: Repository<ServiceEntity>,
        private readonly categoryService: CategoryService,
        private readonly serviceMediaService: ServiceMediaService,
    ) {}

    isValid(serviceId: string) {
        return this.seriviceBaseRepository.findOne({ where: { id: serviceId }, loadEagerRelations: false });
    }

    getSnapshot(id: string) {
        return this.seriviceBaseRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    async save(userId: string, employeeId: string, body: CreateServiceBaseDto) {
        const { categoryId, parentId, medias, ...props } = body;

        if (parentId) {
            const parent = await this.isValid(parentId);
            if (!parent) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE_PARENT });
            }
        }

        const category = await this.categoryService.isExist(categoryId, 'id');
        if (!category) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_CATEGORY });
        }

        const instance = this.seriviceBaseRepository.create({
            ...props,
            categoryId,
            createdBy: employeeId,
            updatedBy: employeeId,
        });
        const saved = await this.seriviceBaseRepository.save(instance);

        const savedMedia = await this.serviceMediaService.saveMany(userId, employeeId, {
            serviceId: saved.id,
            medias,
        });

        return {
            ...saved,
            media: savedMedia,
        };
    }

    async update(userId: string, employeeId: string, body: UpdateServiceBaseDto) {
        const { medias, ...props } = body;
        const { serviceId, categoryId, parentId } = props;

        const service = await this.isValid(serviceId);
        if (!service) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE });
        }

        if (parentId) {
            const parent = await this.isValid(parentId);
            if (!parent) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE_PARENT });
            }
        }
        if (categoryId) {
            const category = await this.categoryService.isExist(categoryId, 'id');
            if (!category) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_CATEGORY });
            }
        }

        const updateMedia = await this.serviceMediaService.updateMany(userId, employeeId, { serviceId, medias });

        const instance = this.seriviceBaseRepository.create({
            id: serviceId,
            ...props,
            updatedBy: employeeId,
        });

        const saved = await this.seriviceBaseRepository.save(instance);

        return { ...saved, media: updateMedia };
    }
}
