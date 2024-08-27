import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { OrderStatusEnum } from '../../common/enum/order.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { CreateOrderBaseDto } from './dto/order-base-create.dto';
import { FindOrderClientDto } from './dto/order-base-get.dto';
import { OrderEntity } from './entity/order-base.entity';

export const TAX_RATE = 0.08;

@Injectable()
export class OrderBaseService {
    constructor(@InjectRepository(OrderEntity) private readonly orderBaseRepository: Repository<OrderEntity>) {}

    async isOwn(orderId: string, clientId: string) {
        const order = await this.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        if (order.clientId !== clientId) {
            return false;
        }
        return true;
    }

    async updateState(orderId: string, state: OrderStatusEnum, userId: string) {
        const order = await this.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        await this.orderBaseRepository.update({ id: orderId }, { status: state, updatedBy: userId });
        return DataSuccessCodeEnum.OK;
    }

    getOrderClient(clientId: string, body: FindOrderClientDto) {
        const { limit, page, order, filter } = body;

        return this.orderBaseRepository.findAndCount({
            where: {
                ...(Object.entries(filter).length
                    ? {
                          ...filter,
                          code: Like(`%${filter.code || ''}%`),
                      }
                    : filter),
                clientId,
            },
            loadEagerRelations: false,
            take: limit,
            skip: (page - 1) * limit,
            order: {
                ...(Object.entries(order).length ? order : { createdAt: SortByEnum.ASC }),
            },
        });
    }

    get(orderId: string) {
        return this.orderBaseRepository.findOne({ where: { id: orderId }, loadEagerRelations: false });
    }

    create(userId: string, clientId: string, body: CreateOrderBaseDto) {
        const { address, name, paymentType, phone, total, note } = body;

        const taxAmount = Math.round(total * (1 + TAX_RATE));

        const instance = this.orderBaseRepository.create({
            clientId,
            name,
            paymentType,
            phone,
            note,
            address,
            tax: taxAmount,
            paid: false,
            refund: false,
            status: OrderStatusEnum.CONFIRMED,
            taxRate: TAX_RATE * 100,
            total: total + taxAmount,
            createdBy: userId,
            updatedBy: userId,
        });

        return this.orderBaseRepository.save(instance);
    }

    async paidSuccessfull(userId: string, orderId: string) {
        const order = await this.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        await this.orderBaseRepository.update({ id: orderId }, { paid: true, updatedBy: userId });

        return DataSuccessCodeEnum.OK;
    }

    async paidFailed(userId: string, orderId: string) {
        const order = await this.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        await this.orderBaseRepository.update({ id: orderId }, { paid: false, updatedBy: userId });

        return DataSuccessCodeEnum.OK;
    }
}
