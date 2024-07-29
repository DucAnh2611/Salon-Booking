import { Injectable } from '@nestjs/common';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { OrderPaymentTypeEnum, OrderStatusEnum } from '../../common/enum/order.enum';
import { BadRequest, Forbidden } from '../../shared/exception/error.exception';
import { CartProductService } from '../cart-product/cart-product.service';
import { CartServiceService } from '../cart-service/cart-service.service';
import { OrderBaseService } from '../order-base/order-base.service';
import { OrderProductItemService } from '../order-product-item/order-product-item.service';
import { OrderServiceItemService } from '../order-service-item/order-service-item.service';
import { OrderTransactionService } from '../order-transaction/order-transaction.service';
import { CreateOrderProductDto, CreateOrderServiceDto } from './dto/order-create.dto';

@Injectable()
export class OrderService {
    constructor(
        private readonly orderBaseService: OrderBaseService,
        private readonly orderProductItemService: OrderProductItemService,
        private readonly orderServiceItemService: OrderServiceItemService,
        private readonly orderTransactionService: OrderTransactionService,
        private readonly cartProductService: CartProductService,
        private readonly cartServiceService: CartServiceService,
    ) {}

    async createOrderProduct(clientId: string, body: CreateOrderProductDto) {
        const { contact, paymentType, products } = body;

        const [_, totalAmount] = await Promise.all([
            this.orderProductItemService.checkValidListProduct(products),
            this.orderProductItemService.getTotalAmount(products),
        ]);

        const newOrder = await this.orderBaseService.create(clientId, {
            ...contact,
            paymentType,
            total: totalAmount,
        });

        const insertProductItems = await this.orderProductItemService.create(newOrder.id, products);

        if (paymentType === OrderPaymentTypeEnum.BANK) {
            const { paymentUrl } = await this.orderTransactionService.createTransactionOrderProduct(
                newOrder.id,
                parseInt(newOrder.code),
                totalAmount,
            );

            return {
                paymentUrl,
            };
        }

        const removeCart = await this.cartProductService.removeCart(clientId);

        return newOrder;
    }

    async createOrderService(clientId: string, body: CreateOrderServiceDto) {
        const { contact, paymentType, services } = body;

        const [_, totalAmount] = await Promise.all([
            this.orderServiceItemService.checkListService(services),
            this.orderServiceItemService.getTotalAmount(services),
        ]);

        const newOrder = await this.orderBaseService.create(clientId, {
            ...contact,
            paymentType,
            total: totalAmount,
        });

        const insertServiceItem = await this.orderServiceItemService.add(newOrder.id, services);

        if (paymentType === OrderPaymentTypeEnum.BANK) {
            // const { paymentUrl } = await this.orderTransactionService.createTransactionOrderProduct(newOrder.id);

            return {
                paymentUrl: '',
            };
        }

        const removeCart = await this.cartServiceService.removeCart(clientId);

        return newOrder;
    }

    updateOrderStatus(clientId: string, orderId: string, status: OrderStatusEnum) {}

    clientListOrder(clientId: string) {}

    async detail(clientId: string, orderId: string) {
        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        if (order.clientId !== clientId) {
            throw new Forbidden({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }

        const [services, products] = await Promise.all([
            this.orderServiceItemService.getServiceOrder(orderId),
            this.orderProductItemService.getProductByOrder(orderId),
        ]);

        order.services = services;
        order.products = products;

        return order;
    }
}
