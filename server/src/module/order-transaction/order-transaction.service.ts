import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PayOS from '@payos/node';
import { LessThanOrEqual, Repository } from 'typeorm';
import { LOGGER_CONSTANT_NAME } from '../../common/constant/logger.constant';
import { OrderPaymentStatusEnum } from '../../common/enum/order.enum';
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

    async createTransactionOrderProduct(orderId: string) {
        const items = await this.orderProductItemService.getProductByOrder(orderId);

        const contact = await this.orderBaseService.get(orderId);

        const instance = this.orderTransactionRepository.create({});
        return { paymentUrl: '' };
    }

    async createTransactionOrderService(orderId: string) {
        const items = await this.orderServiceItemService.getServiceOrder(orderId);

        const contact = await this.orderBaseService.get(orderId);

        const instance = this.orderTransactionRepository.create({});

        return { paymentUrl: '' };
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

    test() {
        return this.payos.createPaymentLink({
            amount: 100000,
            cancelUrl: 'http://localhost:3000/cancel',
            returnUrl: 'http://localhost:3000/ok',
            orderCode: 1231232,
            description: 'DESC',
        });
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
