import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, In, Like, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { OrderStatusEnum } from '../../common/enum/order.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { ParseOrderString } from '../../shared/utils/parse-dynamic-queyry.utils';
import { CategoryService } from '../category/category.service';
import { OrderServiceItemEntity } from '../order-service-item/entity/order-service-item.entity';
import { ServiceMediaService } from '../service-media/service-media.service';
import { ServiceStepEntity } from '../service-step/entity/service-step.entity.entity';
import { FindServiceAdminDto } from '../service/dto/service-get.dto';
import { CreateServiceBaseDto } from './dto/service-base-create.dto';
import { FindServiceBaseDto } from './dto/service-base-get.dto';
import { UpdateServiceBaseDto } from './dto/service-base-update.dto';
import { ServiceEntity } from './entity/service.entity';

@Injectable()
export class ServiceBaseService {
    constructor(
        @InjectRepository(ServiceEntity) private readonly seriviceBaseRepository: Repository<ServiceEntity>,
        @InjectRepository(ServiceStepEntity) private readonly seriviceStepRepository: Repository<ServiceStepEntity>,
        @InjectRepository(OrderServiceItemEntity)
        private readonly orderServiceItemRepository: Repository<OrderServiceItemEntity>,
        private readonly categoryService: CategoryService,
        private readonly serviceMediaService: ServiceMediaService,
    ) {}

    async findClient(body: FindServiceBaseDto) {
        const { key = '', limit, page, price, duration, categoryIds } = body;

        const [items, count] = await this.seriviceBaseRepository.findAndCount({
            where: {
                name: ILike(`%${key}%`),
                price: price.to ? Between(price.from, price.to) : MoreThanOrEqual(price.from),
                duration: duration.to ? Between(duration.from, duration.to) : MoreThanOrEqual(duration.from),
                ...(categoryIds.length ? { categoryId: In(categoryIds) } : {}),
            },
            loadEagerRelations: false,
            order: { createdAt: SortByEnum.ASC },
            skip: (page - 1) * limit,
            take: limit,
        });

        const mapMedia = await Promise.all(
            items.map(async item => {
                const media = await this.serviceMediaService.getListByService(item.id);
                const stepCounts = await this.seriviceStepRepository.count({
                    where: { serviceId: item.id },
                    loadEagerRelations: false,
                });
                const bookingCounts = await this.orderServiceItemRepository.count({
                    where: { serviceId: item.id, order: { status: Not(In([OrderStatusEnum.CANCELLED])) } },
                    loadEagerRelations: false,
                });

                return {
                    ...item,
                    media: media,
                    stepCounts,
                    bookingCounts,
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

    async related(relatedCategoryIds: string[], serviceId?: string) {
        const related = await this.seriviceBaseRepository.find({
            where: {
                ...(serviceId ? { id: Not(serviceId) } : {}),
                ...(relatedCategoryIds.length ? { categoryId: In(relatedCategoryIds) } : {}),
            },
            loadEagerRelations: false,
            take: 10,
            skip: 0,
        });

        const mapMedia = await Promise.all(
            related.map(async item => {
                const media = await this.serviceMediaService.getListByService(item.id);
                const stepCounts = await this.seriviceStepRepository.count({
                    where: { serviceId: item.id },
                    loadEagerRelations: false,
                });
                const bookingCounts = await this.orderServiceItemRepository.count({
                    where: { serviceId: item.id, order: { status: Not(In([OrderStatusEnum.CANCELLED])) } },
                    loadEagerRelations: false,
                });

                return {
                    ...item,
                    media: media,
                    stepCounts,
                    bookingCounts,
                };
            }),
        );

        return mapMedia;
    }

    isValid(serviceId: string) {
        return this.seriviceBaseRepository.findOne({ where: { id: serviceId }, loadEagerRelations: false });
    }

    getSnapshot(id: string) {
        return this.seriviceBaseRepository.findOne({
            where: { id },
            loadEagerRelations: false,
            relations: { category: true, media: { media: true } },
        });
    }

    async detail(id: string) {
        const service = await this.seriviceBaseRepository.findOne({
            where: { id },
            loadEagerRelations: false,
            relations: {
                userUpdate: {
                    userBase: {
                        userAvatar: true,
                    },
                    eRole: true,
                },
                category: true,
                userCreate: {
                    userBase: {
                        userAvatar: true,
                    },
                    eRole: true,
                },
            },
        });

        if (!service) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE });
        }

        const media = await this.serviceMediaService.getListByService(id);

        return {
            ...service,
            media,
        };
    }

    async detailClient(id: string) {
        const service = await this.seriviceBaseRepository.findOne({
            where: { id },
            loadEagerRelations: false,
            relations: {
                category: true,
                media: {
                    media: true,
                },
                steps: {
                    thumbnail: true,
                },
            },
            order: {
                steps: {
                    step: SortByEnum.ASC,
                },
            },
        });

        if (!service) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE });
        }

        return {
            ...service,
        };
    }

    async findAdmin(query: FindServiceAdminDto) {
        const { key, limit, orderBy, page } = query;

        const order = orderBy ? ParseOrderString(orderBy) : { createdAt: SortByEnum.ASC };
        const [list, count] = await this.seriviceBaseRepository.findAndCount({
            where: {
                name: Like(`%${key}%`),
            },
            loadEagerRelations: false,
            order: {
                ...order,
            },
            relations: {
                userCreate: {
                    userBase: true,
                },
                userUpdate: {
                    userBase: true,
                },
                category: true,
                media: false,
                steps: false,
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { list, count, page, limit };
    }

    async feature() {
        const query: Array<{ id: string; count: number }> = await this.orderServiceItemRepository
            .createQueryBuilder('os')
            .innerJoinAndSelect('os.service', 's')
            .innerJoinAndSelect('os.order', 'o')
            .select('os.serviceId', 'id')
            .addSelect('COUNT(os.serviceId)', 'count')
            .groupBy('os.serviceId')
            .orderBy('COUNT(os.serviceId)', 'DESC')
            .where('s.deletedAt IS NULL')
            .andWhere('o.status = :status', { status: OrderStatusEnum.FINISH })
            .take(4)
            .getRawMany();

        const items = await this.seriviceBaseRepository.find({
            where: { id: In(query.map(item => item.id)) },
            loadEagerRelations: false,
            order: { createdAt: SortByEnum.DESC },
        });

        const mapMedia = await Promise.all(
            items.map(async item => {
                const media = await this.serviceMediaService.getListByService(item.id);
                const stepCounts = await this.seriviceStepRepository.count({
                    where: { serviceId: item.id },
                    loadEagerRelations: false,
                });
                const bookingCounts = query.find(i => i.id === item.id)?.count || 0;

                return {
                    ...item,
                    media: media,
                    stepCounts,
                    bookingCounts,
                };
            }),
        );

        return mapMedia;
    }

    async find(query: FindServiceAdminDto) {
        const { key, limit, orderBy, page } = query;

        const order = orderBy ? ParseOrderString(orderBy) : { createdAt: SortByEnum.ASC };
        const list = await this.seriviceBaseRepository.find({
            where: {
                name: Like(`%${key}%`),
            },
            loadEagerRelations: false,
            order: {
                ...order,
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return list;
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

    async deleteMany(ids: string[]) {
        const deleted = await this.seriviceBaseRepository.softDelete({ id: In(ids) });
        return DataSuccessCodeEnum.OK;
    }
}
