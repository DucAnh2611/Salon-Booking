import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { OrderRefundRequestStatusEnum } from '../../common/enum/order.enum';
import { OrderRefundStateService } from '../order-refund-state/order-refund-state.service';
import { CreateOrderRefundRequestDto } from './dto/order-refund-request-create.dto';
import { UpdateOrderRefundRequestDto } from './dto/order-refund-request-update.dto';
import { OrderRefundRequestEntity } from './entity/order-refund-request.entity';

@Injectable()
export class OrderRefundRequestService {
    constructor(
        @InjectRepository(OrderRefundRequestEntity)
        private readonly orderRefundRequestRepository: Repository<OrderRefundRequestEntity>,
        private readonly orderRefundStateService: OrderRefundStateService,
    ) {}

    getByRequestId(id: string) {
        return this.orderRefundRequestRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    getByOrder(orderId: string) {
        return this.orderRefundRequestRepository.find({
            where: {
                orderId,
            },
            loadEagerRelations: false,
            relations: {
                userCreate: {
                    userAvatar: true,
                },
                userUpdate: {
                    userAvatar: true,
                },
                orderRefundStates: {
                    media: true,
                    userCreate: {
                        userAvatar: true,
                    },
                },
            },
        });
    }

    async getCurrentPendingRequest(orderId: string) {
        return this.orderRefundRequestRepository.findOne({
            where: {
                orderId,
                expireAt: MoreThan(new Date()),
                status: OrderRefundRequestStatusEnum.PENDING,
            },
            loadEagerRelations: false,
        });
    }

    async initRefundRequest(userId: string, body: CreateOrderRefundRequestDto) {
        const { orderId, amount, accountBankBin, accountName, accountNumber } = body;
        const currentRequest = await this.getCurrentPendingRequest(orderId);
        if (currentRequest) return currentRequest;

        const newRequest = await this.orderRefundRequestRepository.save({
            orderId,
            amount,
            accountBankBin,
            accountName,
            accountNumber,
            status: OrderRefundRequestStatusEnum.PENDING,
            updatedBy: userId,
            createdBy: userId,
        });

        return newRequest;
    }

    async updateRefundRequest(body: UpdateOrderRefundRequestDto) {
        const { requestId, status, userId } = body;

        await this.orderRefundRequestRepository.update({ id: requestId }, { status: status, updatedBy: userId });

        return DataSuccessCodeEnum.OK;
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async cleanRequest() {
        const listExpire = await this.orderRefundRequestRepository.find({
            where: {
                expireAt: LessThanOrEqual(new Date()),
                status: OrderRefundRequestStatusEnum.PENDING,
            },
            loadEagerRelations: false,
        });

        await this.orderRefundRequestRepository.save(
            listExpire.map(item => ({ ...item, status: OrderRefundRequestStatusEnum.EXPIRED })),
        );

        await Promise.all(listExpire.map(item => this.orderRefundStateService.addAutoDecline(item.id)));
    }
}
