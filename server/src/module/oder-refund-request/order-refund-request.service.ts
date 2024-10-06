import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { LOGGER_CONSTANT_NAME } from '../../common/constant/logger.constant';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { OrderRefundRequestStatusEnum, OrderRefundStatusEnum } from '../../common/enum/order.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { addMinutesToCurrentTime } from '../../shared/utils/date.utils';
import { BankService } from '../bank/bank.service';
import { AppLoggerService } from '../logger/logger.service';
import { OrderRefundStateService } from '../order-refund-state/order-refund-state.service';
import { CreateOrderRefundRequestDto } from './dto/order-refund-request-create.dto';
import { UpdateOrderRefundRequestDto } from './dto/order-refund-request-update.dto';
import { OrderRefundRequestEntity } from './entity/order-refund-request.entity';

@Injectable()
export class OrderRefundRequestService {
    private readonly logger: AppLoggerService = new AppLoggerService(LOGGER_CONSTANT_NAME.cron, 'Cron Job');

    constructor(
        @InjectRepository(OrderRefundRequestEntity)
        private readonly orderRefundRequestRepository: Repository<OrderRefundRequestEntity>,
        private readonly orderRefundStateService: OrderRefundStateService,
        private readonly bankService: BankService,
    ) {}

    refundCountOrder(orderId: string) {
        return this.orderRefundRequestRepository.count({ where: { orderId }, loadEagerRelations: false });
    }

    async canCreateRefund(orderId: string, transactionId: string) {
        const conditionCantRefund = [
            OrderRefundRequestStatusEnum.APPROVED,
            OrderRefundRequestStatusEnum.PENDING,
            OrderRefundRequestStatusEnum.RECEIVED,
        ];
        const listRefundReq = await this.getByOrderTransaction(orderId, transactionId);

        for (const refund of listRefundReq) {
            if (conditionCantRefund.includes(refund.status)) {
                return false;
            }
        }

        return true;
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
                transaction: true,
            },
            order: {
                createdAt: SortByEnum.DESC,
                orderRefundStates: {
                    createdAt: SortByEnum.ASC,
                },
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

    async getPendingRequest(orderId: string, transactionId?: string) {
        return this.orderRefundRequestRepository.find({
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

        const currentRequest = await this.getPendingRequest(orderId, transactionId);
        if (currentRequest.length) {
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
            expiredAt: addMinutesToCurrentTime(24 * 60),
        });

        const newRequest = await this.orderRefundRequestRepository.save(instance);

        return newRequest;
    }

    async updateRefundRequest(body: UpdateOrderRefundRequestDto) {
        const { requestId, status, userId } = body;

        await this.orderRefundRequestRepository.update({ id: requestId }, { status: status, updatedBy: userId });

        return DataSuccessCodeEnum.OK;
    }

    async cancelRefundRequest(userId: string, requestId: string, orderId: string) {
        const isExist = await this.orderRefundRequestRepository.findOne({
            where: { id: requestId, orderId },
            loadEagerRelations: false,
        });

        if (!isExist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_REFUND_REQUEST });
        }

        if (isExist.status === OrderRefundRequestStatusEnum.APPROVED) {
            throw new BadRequest({ message: DataErrorCodeEnum.APPROVED_REFUND_REQUEST });
        }

        if (isExist.status !== OrderRefundRequestStatusEnum.PENDING) {
            throw new BadRequest({ message: DataErrorCodeEnum.REFUND_REQUEST_MUST_BE_PENDING });
        }

        await this.orderRefundRequestRepository.update(
            { id: requestId, orderId },
            {
                status: OrderRefundRequestStatusEnum.CANCELLED,
                updatedBy: userId,
            },
        );
        return DataSuccessCodeEnum.OK;
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async cleanRequest() {
        const listExpire = await this.orderRefundRequestRepository.find({
            where: {
                expiredAt: LessThanOrEqual(new Date()),
                status: OrderRefundRequestStatusEnum.PENDING,
            },
            loadEagerRelations: false,
        });

        if (!listExpire.length) return;

        Promise.all([
            this.orderRefundRequestRepository.update(
                { id: In(listExpire.map(item => item.id)) },
                { status: OrderRefundRequestStatusEnum.EXPIRED },
            ),
            ...listExpire.map(item => this.orderRefundStateService.addAutoDecline(item.id)),
        ]);

        this.logger.info(`Auto expire ${listExpire.length} refund request`);
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async receiveRequest() {
        const listApproved = await this.orderRefundRequestRepository.find({
            where: {
                status: OrderRefundRequestStatusEnum.APPROVED,
            },
            loadEagerRelations: false,
        });
        if (!listApproved.length) return;

        Promise.all([
            this.orderRefundRequestRepository.update(
                { id: In(listApproved.map(item => item.id)) },
                { status: OrderRefundRequestStatusEnum.RECEIVED },
            ),
            ...listApproved.map(item =>
                this.orderRefundStateService.sytemAddState(item.id, OrderRefundStatusEnum.RECEIVED),
            ),
        ]);

        this.logger.info(`Auto receive ${listApproved.length} refund request`);
    }
}
