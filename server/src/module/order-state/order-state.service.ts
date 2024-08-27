import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { OrderStatusEnum } from '../../common/enum/order.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { CreateOrderStateDto } from './dto/order-state-create.entity';
import { OrderStateEntity } from './entity/order-state.entity';

@Injectable()
export class OrderStateService {
    constructor(
        @InjectRepository(OrderStateEntity) private readonly orderStateRepository: Repository<OrderStateEntity>,
    ) {}

    getByOrder(orderId: string) {
        return this.orderStateRepository.find({
            where: { orderId },
            loadEagerRelations: false,
            relations: { userCreate: { userAvatar: true } },
        });
    }

    async canCancel(orderId: string) {
        const canNotCancel = [
            OrderStatusEnum.PROCESSING,
            OrderStatusEnum.SHIPPING,
            OrderStatusEnum.SHIPPED,
            OrderStatusEnum.RECEIVED,
            OrderStatusEnum.CALL_CONFIRM,
            OrderStatusEnum.ARRIVED,
            OrderStatusEnum.ON_SERVICE,
            OrderStatusEnum.PAYING,
            OrderStatusEnum.FINISH,

            OrderStatusEnum.CANCELLED,
            OrderStatusEnum.REFUNDED,
            OrderStatusEnum.RETURNED,
        ];

        const orderStates = await this.orderStateRepository.find({
            where: {
                state: In(canNotCancel),
                orderId,
            },
            loadEagerRelations: false,
        });

        return !orderStates.length;
    }

    async addState(body: CreateOrderStateDto) {
        const { userId, description, orderId, state } = body;
        const states = await this.orderStateRepository.findOne({
            where: { orderId: orderId, state },
            loadEagerRelations: false,
            relations: { order: true },
            order: {
                createdAt: SortByEnum.DESC,
            },
        });

        if (!states) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_STATE_EXIST });
        }

        return this.orderStateRepository.save({
            orderId,
            description,
            userId,
            state,
        });
    }
}
