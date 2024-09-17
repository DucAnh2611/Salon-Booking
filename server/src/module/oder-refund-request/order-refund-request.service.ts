import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { OrderRefundRequestStatusEnum } from '../../common/enum/order.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { BankService } from '../bank/bank.service';
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
        private readonly bankService: BankService,
    ) {}

    async canCreateRefund(orderId: string, transactionId: string) {
        const conditionCantRefund = [
            OrderRefundRequestStatusEnum.APPROVED,
            OrderRefundRequestStatusEnum.PENDING,
            OrderRefundRequestStatusEnum.RECEIVED,
        ];
        const listRefundReq = await this.getByOrderTransaction(orderId, transactionId);

        let canCreate = true;

        for (const refund of listRefundReq) {
            if (conditionCantRefund.includes(refund.status)) {
                canCreate = false;
                break;
            }
        }

        return canCreate;
    }

    getByOrderTransaction(orderId: string, transactionId: string) {
        return this.orderRefundRequestRepository.find({
            where: { orderId, transactionId },
            loadEagerRelations: false,
        });
    }

    getByRequestId(id: string) {
        return this.orderRefundRequestRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    async getByOrder(orderId: string) {
        const refundRequest = await this.orderRefundRequestRepository.find({
            where: {
                orderId,
            },
            loadEagerRelations: false,
            relations: {
                orderRefundStates: {
                    media: true,
                },
            },
            order: {
                createdAt: SortByEnum.DESC,
            },
        });

        const mapBank = await Promise.all(
            refundRequest.map(async r => {
                const bankInfo = await this.bankService.getBankFromBin(parseInt(r.accountBankBin));
                return {
                    bank: bankInfo || null,
                    ...r,
                };
            }),
        );

        return mapBank;
    }

    async getCurrentPendingRequest(orderId: string, transactionId?: string) {
        return this.orderRefundRequestRepository.findOne({
            where: {
                orderId,
                transactionId: transactionId ? transactionId : IsNull(),
                expiredAt: MoreThan(new Date()),
                status: OrderRefundRequestStatusEnum.PENDING,
            },
            loadEagerRelations: false,
        });
    }

    async initRefundRequest(userId: string, body: CreateOrderRefundRequestDto) {
        const { orderId, amount, accountBankBin, accountName, accountNumber, transactionId, note } = body;
        const currentRequest = await this.getCurrentPendingRequest(orderId, transactionId);
        if (currentRequest) {
            throw new BadRequest({ message: DataErrorCodeEnum.REFUND_REQUEST_IS_PROCESSING });
        }

        const instance = this.orderRefundRequestRepository.create({
            orderId,
            transactionId: transactionId || null,
            amount,
            accountBankBin: accountBankBin,
            accountBankName: accountName,
            accountBankNumber: accountNumber,
            status: OrderRefundRequestStatusEnum.PENDING,
            description: note || '',
            updatedBy: userId,
            createdBy: userId,
        });

        const newRequest = await this.orderRefundRequestRepository.save(instance);

        return newRequest;
    }

    async updateRefundRequest(body: UpdateOrderRefundRequestDto) {
        const { requestId, status, userId } = body;

        await this.orderRefundRequestRepository.update({ id: requestId }, { status: status, updatedBy: userId });

        return DataSuccessCodeEnum.OK;
    }

    @Cron(CronExpression.EVERY_30_MINUTES)
    async cleanRequest() {
        const listExpire = await this.orderRefundRequestRepository.find({
            where: {
                expiredAt: LessThanOrEqual(new Date()),
                status: OrderRefundRequestStatusEnum.PENDING,
            },
            loadEagerRelations: false,
        });

        this.orderRefundRequestRepository.save(
            listExpire.map(item => ({ ...item, status: OrderRefundRequestStatusEnum.EXPIRED })),
        );

        Promise.all(listExpire.map(item => this.orderRefundStateService.addAutoDecline(item.id)));
    }
}
