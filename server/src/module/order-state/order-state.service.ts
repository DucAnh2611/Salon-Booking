import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatusEnum } from '../../common/enum/order.enum';
import { SortByEnum } from '../../common/enum/query.enum';
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
            order: { createdAt: SortByEnum.DESC },
        });
    }
    async addState(body: CreateOrderStateDto) {
        const { userId, description, orderId, state } = body;

        return this.orderStateRepository.save({
            orderId,
            description,
            state,
            createdBy: userId,
        });
    }
    async addCancelExpired(orderId: string) {
        return this.orderStateRepository.save({
            orderId,
            description: 'Tự động hủy đơn hết hạn',
            state: OrderStatusEnum.CANCELLED,
        });
    }
}
