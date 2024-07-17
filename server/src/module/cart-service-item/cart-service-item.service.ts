import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { ServiceEntity } from '../service-base/entity/service.entity';
import { CreateCartServiceItemDto } from './dto/cart-service-item-create.dto';
import { CartServiceItemEntity } from './entity/cart-service-item.entity';

@Injectable()
export class CartServiceItemService {
    constructor(
        @InjectRepository(CartServiceItemEntity)
        private readonly cartServiceItemRepository: Repository<CartServiceItemEntity>,
        @InjectRepository(ServiceEntity) private readonly serviceRepository: Repository<ServiceEntity>,
    ) {}

    isExist(id: string) {
        return this.cartServiceItemRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    async isExistService(cartServiceId: string, serviceId: string) {
        const find = await this.cartServiceItemRepository.find({
            where: {
                cartServiceId,
                serviceId,
            },
            loadEagerRelations: false,
        });

        return find.length > 0;
    }

    async get(cartServiceId: string) {
        const querybuilder = this.cartServiceItemRepository.createQueryBuilder('cs');
        const query = querybuilder
            .withDeleted()
            .leftJoinAndSelect('cs.service', 'service')
            .select(['cs', 'cs.product'])
            .where('cs.cartId = :id', { id: cartServiceId });

        return query.getMany();
    }

    async isValidService(serviceId: string) {
        const service = await this.serviceRepository.findOne({ where: { id: serviceId }, loadEagerRelations: true });
        if (!service) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE });
        }
        return true;
    }

    async create(cartServiceId: string, body: CreateCartServiceItemDto) {
        const { serviceId } = body;

        const isExistInCart = await this.isExistService(cartServiceId, serviceId);
        if (isExistInCart) {
            throw new BadRequest({ message: DataErrorCodeEnum.SERVICE_ADDED });
        }

        const instance = this.cartServiceItemRepository.create({
            serviceId,
            cartServiceId,
        });

        return this.cartServiceItemRepository.save(instance);
    }

    async deleteOne(cartServiceItemId: string) {
        const isExist = await this.isExist(cartServiceItemId);
        if (!isExist) {
            throw new BadRequest({ message: DataErrorCodeEnum.SERVICE_NOT_ADDED });
        }

        const remove = await this.cartServiceItemRepository.delete({ id: cartServiceItemId });

        return DataSuccessCodeEnum.OK;
    }
}
