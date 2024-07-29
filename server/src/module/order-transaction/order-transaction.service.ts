import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PayOS from '@payos/node';
import { LessThanOrEqual, Repository } from 'typeorm';
import { LOGGER_CONSTANT_NAME } from '../../common/constant/logger.constant';
import { ROUTER } from '../../common/constant/router.constant';
import { OrderPaymentStatusEnum } from '../../common/enum/order.enum';
import { appConfig } from '../../config/app.config';
import { payosConfig } from '../../config/payos.config';
import { AppLoggerService } from '../logger/logger.service';
import { OrderBaseService } from '../order-base/order-base.service';
import { OrderProductItemService } from '../order-product-item/order-product-item.service';
import { OrderServiceItemService } from '../order-service-item/order-service-item.service';
import { OrderTransactionEntity } from './entity/order-transaction.entity';

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
    ) {
        this.payos = new PayOS(payosConfig.CLIENT_ID, payosConfig.API_KEY, payosConfig.CHECKSUM_KEY);
    }

    async createTransactionOrderProduct(orderId: string, orderCode: number, amount: number) {
        const items = await this.orderProductItemService.getProductByOrder(orderId);

        const contact = await this.orderBaseService.get(orderId);

        const payment = await this.payos.createPaymentLink({
            orderCode,
            amount,
            description: `TT DON HANG ${orderCode}`,
            cancelUrl: `${appConfig.url}/${appConfig.prefix}/${ROUTER.ORDER_TRANSACTION}/ok/${orderId}`,
            returnUrl: `${appConfig.url}/${appConfig.prefix}/${ROUTER.ORDER_TRANSACTION}/cancel/${orderId}`,
            items: items.map(item => {
                let price = item.productSnapshot.price;
                let name = item.productSnapshot.name;

                if (item.productTypeId) {
                    price = item.productTypeSnapshot.price;
                    const addedName = `${name} - ${item.productTypeSnapshot.productTypesAttribute.reduce(
                        (acc, curr) => {
                            return `${acc} - ${curr.attribute.name}`;
                        },
                        '',
                    )}`;
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
        });

        const instance = this.orderTransactionRepository.create({
            accountName: payment.accountName,
            accountNumber: payment.accountNumber,
            description: payment.description,
            orderAmount: amount,
            orderId,
            orderCode: orderCode.toString(),
            paymentUrl: payment.checkoutUrl,
            paymentId: payment.paymentLinkId,
            status: OrderPaymentStatusEnum.PENDING,
        });

        const saved = await this.orderTransactionRepository.save(instance);

        return { paymentUrl: payment.checkoutUrl };
    }

    async createTransactionOrderService(orderId: string, orderCode: number, amount: number) {
        const items = await this.orderServiceItemService.getServiceOrder(orderId);

        const contact = await this.orderBaseService.get(orderId);

        const payment = await this.payos.createPaymentLink({
            orderCode,
            amount,
            description: `TT DON HANG ${orderCode}`,
            cancelUrl: `${appConfig.url}/${appConfig.prefix}/${ROUTER.ORDER_TRANSACTION}/ok/${orderId}`,
            returnUrl: `${appConfig.url}/${appConfig.prefix}/${ROUTER.ORDER_TRANSACTION}/cancel/${orderId}`,
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
        });

        const instance = this.orderTransactionRepository.create({
            accountName: payment.accountName,
            accountNumber: payment.accountNumber,
            description: payment.description,
            orderAmount: amount,
            orderId,
            orderCode: orderCode.toString(),
            paymentUrl: payment.checkoutUrl,
            paymentId: payment.paymentLinkId,
            status: OrderPaymentStatusEnum.PENDING,
        });

        const saved = await this.orderTransactionRepository.save(instance);

        return { paymentUrl: payment.checkoutUrl };
    }

    getTransactionByOrderAdmin(orderId: string) {
        return this.orderTransactionRepository.find({ where: { orderId }, loadEagerRelations: false });
    }

    async getTransactionByOrder(clientId: string, orderId: string) {
        const orderTransaction = await this.orderTransactionRepository.find({
            where: { orderId, order: { clientId } },
            loadEagerRelations: false,
            relations: {
                order: true,
            },
        });

        return orderTransaction;
    }

    // @Cron(CRON_EXPRESSION.EVERY_1_MINUTES)
    async expireTransaction() {
        const findExpireTransaction = await this.orderTransactionRepository.find({
            where: {
                expireAt: LessThanOrEqual(new Date()),
            },
            loadEagerRelations: false,
        });
        if (findExpireTransaction.length) {
            await this.orderTransactionRepository.update(
                findExpireTransaction.map(tst => tst.id),
                { status: OrderPaymentStatusEnum.CANCELLED },
            );
            this.logger.info(
                `Auto cancel ${findExpireTransaction.length} transaction at: ${new Date().toLocaleString()}`,
            );
        }
    }
}
