import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import PayOS from '@payos/node';
import { In, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { CRON_EXPRESSION } from '../../common/constant/cron.constant';
import { LOGGER_CONSTANT_NAME } from '../../common/constant/logger.constant';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { OrderPaymentStatusEnum } from '../../common/enum/order.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { appConfig } from '../../config/app.config';
import { payosConfig } from '../../config/payos.config';
import { BadRequest } from '../../shared/exception/error.exception';
import { addMinutesToCurrentTime, dateToUnixTimestamp } from '../../shared/utils/date.utils';
import { AppLoggerService } from '../logger/logger.service';
import { OrderRefundRequestService } from '../oder-refund-request/order-refund-request.service';
import { OrderBaseService } from '../order-base/order-base.service';
import { OrderProductItemService } from '../order-product-item/order-product-item.service';
import { OrderServiceItemService } from '../order-service-item/order-service-item.service';
import { OrderTransactionEntity } from './entity/order-transaction.entity';

const TRACSACTION_EXPIRE_MINUTES = 30;

@Injectable()
export class OrderTransactionService {
    private readonly logger: AppLoggerService = new AppLoggerService(LOGGER_CONSTANT_NAME.order, 'Order');
    private readonly payos: PayOS;

    constructor(
        @InjectRepository(OrderTransactionEntity)
        private readonly orderTransactionRepository: Repository<OrderTransactionEntity>,
        private readonly orderProductItemService: OrderProductItemService,
        private readonly orderServiceItemService: OrderServiceItemService,
        private readonly orderBaseService: OrderBaseService,
        private readonly orderRefundRequestService: OrderRefundRequestService,
    ) {
        this.payos = new PayOS(payosConfig.CLIENT_ID, payosConfig.API_KEY, payosConfig.CHECKSUM_KEY);
    }

    async countTransactionByOrder(orderId: string) {
        return this.orderTransactionRepository.count({ where: { orderId } });
    }

    async isTransactionPending(orderId: string) {
        const order = await this.orderBaseService.get(orderId);
        return this.orderTransactionRepository.findOne({
            where: {
                orderCode: order.code,
                orderId: orderId,
                status: OrderPaymentStatusEnum.PENDING,
                expireAt: MoreThan(new Date()),
            },
            loadEagerRelations: false,
        });
    }

    async createTransactionOrderProduct(orderId: string, orderCode: number, amount: number) {
        const isExistPending = await this.isTransactionPending(orderId);
        if (isExistPending) {
            return isExistPending;
        }

        const items = await this.orderProductItemService.getProductByOrder(orderId);

        const contact = await this.orderBaseService.get(orderId);

        const expireAt = addMinutesToCurrentTime(TRACSACTION_EXPIRE_MINUTES);

        const transCount = await this.countTransactionByOrder(orderId);

        const orderCodePayment = parseInt(`${orderCode}${transCount}`);

        const payment = await this.payos.createPaymentLink({
            orderCode: orderCodePayment,
            amount,
            description: `TT DON HANG ${orderCode}`,
            cancelUrl: `${appConfig.clientUrl}/transaction/${orderId}/cancel`,
            returnUrl: `${appConfig.clientUrl}/transaction/${orderId}/ok`,
            items: items.map(item => {
                let price = item.productSnapshot.price;
                let name = item.productSnapshot.name;

                if (item.productTypeId) {
                    price = item.productTypeSnapshot.price;
                    const addedName = `${name} - [${item.productTypeSnapshot.productTypesAttribute
                        .map(curr => curr.value.value)
                        .join(' | ')}]`;
                    name = addedName;
                }
                return {
                    quantity: item.quantity,
                    price: price,
                    name: name,
                };
            }),
            buyerAddress: contact.address,
            buyerName: contact.name,
            buyerPhone: contact.phone,
            expiredAt: dateToUnixTimestamp(expireAt),
        });

        const instance = this.orderTransactionRepository.create({
            accountBankBin: payment.bin,
            accountName: payment.accountName,
            accountNumber: payment.accountNumber,
            description: payment.description,
            orderAmount: amount,
            orderId,
            orderCode: orderCode.toString(),
            paymentUrl: payment.checkoutUrl,
            paymentId: payment.paymentLinkId,
            status: OrderPaymentStatusEnum.PENDING,
            expireAt,
        });

        const saved = await this.orderTransactionRepository.save(instance);

        return saved;
    }

    async createTransactionOrderService(orderId: string, orderCode: number, amount: number) {
        const isExistPending = await this.isTransactionPending(orderId);
        if (isExistPending) {
            return isExistPending;
        }

        const items = await this.orderServiceItemService.getServiceOrder(orderId);

        const contact = await this.orderBaseService.get(orderId);

        const expireAt = addMinutesToCurrentTime(TRACSACTION_EXPIRE_MINUTES);

        const payment = await this.payos.createPaymentLink({
            orderCode,
            amount,
            description: `TT DON HANG ${orderCode}`,
            cancelUrl: `${appConfig.url}/${appConfig.prefix}/order/transaction/${orderId}/ok`,
            returnUrl: `${appConfig.url}/${appConfig.prefix}/order/transaction/${orderId}/cancel`,
            items: items.map(item => {
                const name = item.serviceSnapshot.name;
                const price = item.serviceSnapshot.price;

                return {
                    quantity: 1,
                    price: price,
                    name: name,
                };
            }),
            buyerAddress: contact.address,
            buyerName: contact.name,
            buyerPhone: contact.phone,
            expiredAt: dateToUnixTimestamp(expireAt),
        });

        const instance = this.orderTransactionRepository.create({
            accountBankBin: payment.bin,
            accountName: payment.accountName,
            accountNumber: payment.accountNumber,
            description: payment.description,
            orderAmount: amount,
            orderId,
            orderCode: orderCode.toString(),
            paymentUrl: payment.checkoutUrl,
            paymentId: payment.paymentLinkId,
            status: OrderPaymentStatusEnum.PENDING,
            expireAt,
        });

        const saved = await this.orderTransactionRepository.save(instance);

        return saved;
    }

    async cancelTransaction(id: string, paidAmount: number) {
        const isExist = await this.orderTransactionRepository.findOne({
            where: { id, status: OrderPaymentStatusEnum.PENDING },
            loadEagerRelations: false,
        });
        if (!isExist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER_TRANSACTION });
        }

        const [updateTransaction, cancelPaymentLink] = await Promise.all([
            this.orderTransactionRepository.update(
                { id: id, paidAmount },
                { status: OrderPaymentStatusEnum.CANCELLED },
            ),
            this.payos.cancelPaymentLink(isExist.paymentId),
        ]);

        return DataSuccessCodeEnum.OK;
    }

    async updateTransaction(transactionId: string, body: Partial<OrderTransactionEntity>) {
        await this.orderTransactionRepository.update({ id: transactionId }, body);
        return DataSuccessCodeEnum.OK;
    }

    getTransactionByOrderAdmin(orderId: string) {
        return this.orderTransactionRepository.find({
            where: { orderId },
            order: { createdAt: SortByEnum.DESC },
            loadEagerRelations: false,
        });
    }

    async getTransactionByOrder(clientId: string, orderId: string) {
        const orderTransaction = await this.orderTransactionRepository.find({
            where: { orderId, order: { clientId } },
            order: { createdAt: SortByEnum.DESC },
            loadEagerRelations: false,
        });

        const mapCanCreateRefund = await Promise.all(
            orderTransaction.map(async tran => {
                const canCreateRefund = await this.orderRefundRequestService.canCreateRefund(tran.orderId, tran.id);

                const canCreateRefundFinal = tran.paidAmount > tran.orderAmount ? canCreateRefund : false;

                return {
                    ...tran,
                    createRefund: !!canCreateRefundFinal,
                };
            }),
        );

        return mapCanCreateRefund;
    }

    getTransactionState(paymentId: string) {
        return this.payos.getPaymentLinkInformation(paymentId);
    }

    @Cron(CRON_EXPRESSION.EVERY_1_MINUTES)
    async expireTransaction() {
        const findExpireTransaction = await this.orderTransactionRepository.find({
            where: {
                expireAt: LessThanOrEqual(new Date()),
                status: OrderPaymentStatusEnum.PENDING,
            },
            loadEagerRelations: false,
        });

        if (findExpireTransaction.length) {
            await this.orderTransactionRepository.update(
                { id: In(findExpireTransaction.map(tst => tst.id)) },
                { status: OrderPaymentStatusEnum.CANCELLED },
            );
            this.logger.info(
                `Auto cancel ${findExpireTransaction.length} transaction at: ${new Date().toLocaleString()}`,
            );
        }
    }
}
