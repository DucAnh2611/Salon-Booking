import { Injectable } from '@nestjs/common';
import { PaymentLinkDataType } from '@payos/node/lib/type';
import {
    CAN_CANCEL_LIST,
    CAN_RETURN_LIST,
    ORDER_STATE_PRODUCT,
    ORDER_STATE_SERVICE,
} from '../../../common/constant/order.contant';
import { DataErrorCodeEnum } from '../../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../../common/enum/data-success-code.enum';
import {
    OrderPaymentStatusEnum,
    OrderPaymentTypeEnum,
    OrderRefundRequestStatusEnum,
    OrderRefundStatusEnum,
    OrderStatusEnum,
    OrderType,
} from '../../../common/enum/order.enum';
import { ShiftEmployeeStatusEnum } from '../../../common/enum/shift.enum';
import { BadRequest } from '../../../shared/exception/error.exception';
import { isSameObject } from '../../../shared/utils/object.utils';
import { CartProductService } from '../../cart-product/cart-product.service';
import { CartServiceService } from '../../cart-service/cart-service.service';
import {
    CancelOrderRefundRequestDto,
    CancelTransactionDto,
    CreateOrderRefundRequestDto,
} from '../../oder-refund-request/dto/order-refund-request-create.dto';
import { OrderRefundRequestService } from '../../oder-refund-request/order-refund-request.service';
import { FindOrderClientDto } from '../../order-base/dto/order-base-get.dto';
import { OrderBaseService } from '../../order-base/order-base.service';
import { OrderProductItemService } from '../../order-product-item/order-product-item.service';
import { OrderRefundStateService } from '../../order-refund-state/order-refund-state.service';
import { OrderServiceItemService } from '../../order-service-item/order-service-item.service';
import { OrderStateService } from '../../order-state/order-state.service';
import { ReturnUrlTransactionPayOsDto } from '../../order-transaction/dto/order-transaction.get.dto';
import { OrderTransactionService } from '../../order-transaction/order-transaction.service';
import { ShiftEmployeeService } from '../../shift-employee/shift-employee.service';
import { CreateOrderProductDto, CreateOrderServiceDto } from '../dto/order-create.dto';
import { TrackingDetailOrderDto } from '../dto/order-get.dto';
import { ClientCancelOrderStateDto, ClientUpdateOrderStateDto } from '../dto/order-update.dto';

@Injectable()
export class OrderService {
    constructor(
        private readonly orderBaseService: OrderBaseService,
        private readonly orderProductItemService: OrderProductItemService,
        private readonly orderServiceItemService: OrderServiceItemService,
        private readonly orderTransactionService: OrderTransactionService,
        private readonly orderStateService: OrderStateService,
        private readonly orderRefundRequestService: OrderRefundRequestService,
        private readonly orderRefundStateService: OrderRefundStateService,
        private readonly cartProductService: CartProductService,
        private readonly cartServiceService: CartServiceService,
        private readonly shiftEmployeeService: ShiftEmployeeService,
    ) {}

    /** @Order */
    async tracking(code: string, clientId: string) {
        const order = await this.orderBaseService.getCode(code, clientId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isOwn = await this.orderBaseService.isOwn(order.id, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }
        const availableState = await this.availableState(order.id);

        return {
            ...availableState,
            ...order,
        };
    }

    async trackingDetail(clientId: string, detailType: TrackingDetailOrderDto) {
        const { orderId, type } = detailType;
        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isOwn = await this.orderBaseService.isOwn(orderId, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }

        let detail = null;

        switch (type) {
            case 'state':
                detail = await this.orderStateService.getByOrder(orderId);
                break;
            case 'refund':
                detail = await this.orderRefundRequestService.getByOrder(orderId);
                break;
            case 'transaction':
                detail = await this.orderTransactionService.getTransactionByOrder(clientId, orderId);
                break;
            case 'product':
                detail = await this.orderProductItemService.getProductByOrder(orderId);
                break;
            case 'service':
                detail = await this.orderServiceItemService.getServiceOrder(orderId);
                break;
            default:
                return null;
        }

        return detail;
    }

    async clientList(clientId: string, body: FindOrderClientDto) {
        const [items, count] = await this.orderBaseService.getOrderClient(clientId, body);
        return {
            items: items,
            page: body.page,
            limit: body.limit,
            count,
        };
    }

    async createOrderProduct(userId: string, clientId: string, body: CreateOrderProductDto) {
        const { contact, paymentType, products } = body;

        const [_, totalAmount] = await Promise.all([
            this.orderProductItemService.checkValidListProduct(products),
            this.orderProductItemService.getTotalAmount(products),
        ]);

        const newOrder = await this.orderBaseService.create(userId, clientId, {
            ...contact,
            paymentType,
            total: totalAmount,
            type: OrderType.PRODUCT,
        });

        await Promise.all([
            this.orderProductItemService.create(newOrder.id, products),
            this.orderStateService.addState({
                userId,
                orderId: newOrder.id,
                state: OrderStatusEnum.PENDING,
            }),
        ]);

        if (paymentType === OrderPaymentTypeEnum.CASH) {
            await Promise.all([
                this.orderBaseService.updateState(newOrder.id, OrderStatusEnum.CONFIRMED, userId),
                this.orderStateService.addState({
                    userId,
                    orderId: newOrder.id,
                    state: OrderStatusEnum.CONFIRMED,
                }),
            ]);
        }
        if (paymentType === OrderPaymentTypeEnum.BANK) {
            await Promise.all([
                this.orderBaseService.updateState(newOrder.id, OrderStatusEnum.PENDING_PAYMENT, userId),
                this.orderStateService.addState({
                    userId,
                    orderId: newOrder.id,
                    state: OrderStatusEnum.PENDING_PAYMENT,
                }),
            ]);
        }

        await Promise.all([
            this.cartProductService.removeCartItems(
                clientId,
                products.map(productItem => productItem.itemId),
            ),
            this.orderProductItemService.updateProductQuantity(newOrder.id),
        ]);

        return newOrder;
    }

    async createOrderService(userId: string, clientId: string, body: CreateOrderServiceDto) {
        const { contact, paymentType, services } = body;

        const [_, totalAmount] = await Promise.all([
            this.orderServiceItemService.checkListService(services),
            this.orderServiceItemService.getTotalAmount(services),
        ]);

        const newOrder = await this.orderBaseService.create(userId, clientId, {
            ...contact,
            paymentType,
            total: totalAmount,
            type: OrderType.SERVICE,
        });

        await Promise.all([
            this.orderServiceItemService.add(newOrder.id, services),
            this.orderStateService.addState({
                userId,
                orderId: newOrder.id,
                state: OrderStatusEnum.PENDING,
            }),
        ]);

        await Promise.all(
            services.map(service =>
                this.shiftEmployeeService.updateStatus(service.employeeId, {
                    shiftId: service.shiftId,
                    status: ShiftEmployeeStatusEnum.BOOKED,
                }),
            ),
        );

        if (paymentType === OrderPaymentTypeEnum.BANK) {
            await Promise.all([
                this.orderBaseService.updateState(newOrder.id, OrderStatusEnum.PENDING_PAYMENT, userId),
                this.orderStateService.addState({
                    userId,
                    orderId: newOrder.id,
                    state: OrderStatusEnum.PENDING_PAYMENT,
                }),
            ]);
        }

        const [_rmCart] = await Promise.all([
            this.cartServiceService.removeCartItem(
                clientId,
                services.map(service => service.itemId),
            ),
        ]);

        return newOrder;
    }

    async clientCancelOrder(userId: string, clientId: string, body: ClientCancelOrderStateDto) {
        const { orderId, reason } = body;

        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isOwn = await this.orderBaseService.isOwn(orderId, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }

        const { cancelable } = await this.availableState(orderId);
        if (!cancelable) {
            throw new BadRequest({ message: DataErrorCodeEnum.CAN_NOT_CANCEL_ORDER });
        }

        if (order.paymentType === OrderPaymentTypeEnum.BANK) {
            const pendingTransaction = await this.orderTransactionService.isTransactionPending(orderId);
            if (pendingTransaction) {
                const paymentInfo = await this.orderTransactionService.getTransactionState(
                    pendingTransaction.paymentId,
                );
                if (!paymentInfo) {
                    throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PAYMENT_TRANSACTION });
                }

                const paidTransaction = paymentInfo.amountPaid;

                await this.orderTransactionService.cancelTransaction(
                    pendingTransaction.id,
                    paidTransaction,
                    paymentInfo.transactions,
                );
            }
        }

        await Promise.all([
            this.orderBaseService.updateState(orderId, OrderStatusEnum.CANCELLED, userId),
            this.orderStateService.addState({
                orderId,
                state: OrderStatusEnum.CANCELLED,
                description: reason,
                userId,
            }),
        ]);

        switch (order.type) {
            case OrderType.PRODUCT:
                await this.orderProductItemService.restock(order.id);
                break;
            case OrderType.SERVICE:
                await this.orderServiceItemService.setAvailableEmployeeOrder(order.id);
                break;
            default:
                break;
        }

        return DataSuccessCodeEnum.OK;
    }

    /** @Order_Transaction */
    async getPaymentLink(orderId: string, userId: string, clientId: string, type: 'P' | 'S') {
        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isOwn = await this.orderBaseService.isOwn(orderId, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }

        if (order.paymentType !== OrderPaymentTypeEnum.BANK) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_PAYMENT_TYPE_IS_NOT_BANK });
        }

        const pendingTransaction = await this.orderTransactionService.isTransactionPending(orderId);
        if (pendingTransaction) return pendingTransaction;

        const remainAmount = order.total - order.totalPaid;

        if (!remainAmount) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_PAID });
        }

        if (type === 'P') {
            return this.orderTransactionService.createTransactionOrderProduct(
                order.id,
                parseInt(order.code),
                remainAmount,
            );
        }
        return this.orderTransactionService.createTransactionOrderService(order.id, parseInt(order.code), remainAmount);
    }

    async transactionSuccessfull(
        userId: string,
        clientId: string,
        orderId: string,
        returnBody: ReturnUrlTransactionPayOsDto,
    ) {
        const order = await this.orderBaseService.get(orderId);
        if (!order || (order && String(returnBody.orderCode).slice(0, 10) !== order.code)) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isOwn = await this.orderBaseService.isOwn(orderId, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }

        let paymentInfo = undefined;
        try {
            paymentInfo = await this.orderTransactionService.getTransactionState(returnBody.id);
        } catch (error) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PAYMENT_TRANSACTION });
        }

        const paymentDoubleCheck = {
            status: paymentInfo.status,
            id: paymentInfo.id,
            orderCode: paymentInfo.orderCode,
        };
        if (
            !paymentInfo ||
            (paymentInfo &&
                !isSameObject(paymentDoubleCheck, {
                    status: returnBody.status,
                    orderCode: returnBody.orderCode,
                    id: returnBody.id,
                }))
        ) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PAYMENT_TRANSACTION });
        }

        const pendingTransaction = await this.orderTransactionService.isTransactionPending(orderId);
        if (!pendingTransaction) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER_TRANSACTION });
        }

        const [_updateBase, _updateTransaction] = await Promise.all([
            this.orderBaseService.paidSuccessfull(userId, orderId, order.totalPaid + paymentInfo.amountPaid),
            this.orderTransactionService.updateTransaction(pendingTransaction.id, {
                paidAmount: paymentInfo.amountPaid,
                status: OrderPaymentStatusEnum.PAID,
                paymentTransactions: paymentInfo.transactions,
            }),
        ]);

        switch (order.type) {
            case OrderType.PRODUCT:
                if (order.status === OrderStatusEnum.PENDING_PAYMENT) {
                    await this.orderStateService.addState({
                        orderId: order.id,
                        state: OrderStatusEnum.PAID_PAYMENT,
                        userId,
                    });
                    await this.orderStateService.addState({
                        orderId: order.id,
                        state: OrderStatusEnum.CONFIRMED,
                        userId,
                    });
                    await this.orderBaseService.updateState(order.id, OrderStatusEnum.CONFIRMED, userId);
                }
                break;
            case OrderType.SERVICE:
                if (order.status === OrderStatusEnum.PENDING_PAYMENT) {
                    await this.orderStateService.addState({
                        orderId: order.id,
                        state: OrderStatusEnum.PAID_PAYMENT,
                        userId,
                    });
                }
                break;
            default:
                break;
        }

        return DataSuccessCodeEnum.OK;
    }

    async transactionFail(userId: string, clientId: string, orderId: string, returnBody: ReturnUrlTransactionPayOsDto) {
        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isOwn = await this.orderBaseService.isOwn(orderId, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }

        let paymentInfo = undefined;
        try {
            paymentInfo = await this.orderTransactionService.getTransactionState(returnBody.id);
        } catch (error) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PAYMENT_TRANSACTION });
        }

        const paymentDoubleCheck = {
            status: paymentInfo.status,
            id: paymentInfo.id,
            orderCode: paymentInfo.orderCode,
        };
        if (
            !paymentInfo ||
            (paymentInfo &&
                !isSameObject(paymentDoubleCheck, {
                    status: returnBody.status,
                    orderCode: returnBody.orderCode,
                    id: returnBody.id,
                }))
        ) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PAYMENT_TRANSACTION });
        }

        const pendingTransaction = await this.orderTransactionService.isTransactionPending(orderId);
        if (!pendingTransaction) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER_TRANSACTION });
        }

        const [_updateRemain, _cancelTransaction] = await Promise.all([
            this.orderBaseService.paidFailed(userId, orderId, order.totalPaid),
            this.orderTransactionService.updateTransaction(pendingTransaction.id, {
                paidAmount: paymentInfo.amountPaid,
                paymentTransactions: paymentInfo.transactions,
                status: OrderPaymentStatusEnum.CANCELLED,
            }),
        ]);

        return DataSuccessCodeEnum.OK;
    }

    async cancelTranscation(userId: string, clientId: string, orderId: string, body: CancelTransactionDto) {
        const { transactionId, note } = body;

        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isOwn = await this.orderBaseService.isOwn(orderId, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }

        const pendingTransaction = await this.orderTransactionService.isTransactionPending(orderId);
        if (!pendingTransaction || (pendingTransaction && pendingTransaction.id !== transactionId)) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER_TRANSACTION });
        }
        let paymentInfo: PaymentLinkDataType = undefined;

        try {
            paymentInfo = await this.orderTransactionService.getTransactionState(pendingTransaction.paymentId);
        } catch (error) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PAYMENT_TRANSACTION });
        }

        if (!paymentInfo) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PAYMENT_TRANSACTION });
        }

        const [_updateRemain, _cancelTransaction] = await Promise.all([
            this.orderBaseService.paidFailed(userId, orderId, order.totalPaid),
            this.orderTransactionService.cancelTransaction(
                transactionId,
                paymentInfo.amountPaid,
                paymentInfo.transactions,
            ),
        ]);

        return DataSuccessCodeEnum.OK;
    }

    /** @Order_State */
    async clientUpdateState(userId: string, clientId: string, body: ClientUpdateOrderStateDto) {
        const { orderId, state } = body;

        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isOwn = await this.orderBaseService.isOwn(orderId, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }

        const stateList = (order.type === OrderType.PRODUCT ? ORDER_STATE_PRODUCT : ORDER_STATE_SERVICE).normal.client;
        if (!stateList.includes(state)) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_ORDER_STATE });
        }

        await this.orderBaseService.updateState(orderId, state, userId);

        return this.orderStateService.addState({
            orderId,
            state,
            userId,
            description: ``,
        });
    }

    async clientReceiveOrder(userId: string, clientId: string, orderId: string) {
        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isOwn = await this.orderBaseService.isOwn(orderId, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }

        await this.orderBaseService.paidSuccessfull(userId, orderId, order.total);
        await this.clientUpdateState(userId, clientId, {
            orderId,
            state: OrderStatusEnum.RECEIVED,
        });

        return DataSuccessCodeEnum.OK;
    }

    async clientConfirmOrder(userId: string, clientId: string, orderId: string) {
        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isOwn = await this.orderBaseService.isOwn(orderId, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }
        await this.orderBaseService.updateState(orderId, OrderStatusEnum.CONFIRMED, userId);

        return this.orderStateService.addState({
            orderId,
            state: OrderStatusEnum.CONFIRMED,
            userId,
            description: `Đã xác nhận đơn hàng`,
        });
    }

    /** @Order_Refund_Request */
    async createRefundRequest(userId: string, clientId: string, body: CreateOrderRefundRequestDto) {
        const { orderId, amount } = body;

        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isOwn = await this.orderBaseService.isOwn(orderId, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }

        const refundRequest = await this.orderRefundRequestService.initRefundRequest(userId, {
            orderId,
            transactionId: body.transactionId,
            accountBankBin: body.accountBankBin,
            accountName: body.accountName,
            accountNumber: body.accountNumber,
            note: body.note,
            amount: amount,
        });

        await this.orderRefundStateService.addState({
            requestId: refundRequest.id,
            state: OrderRefundStatusEnum.PENDING,
            userId,
        });

        return refundRequest;
    }

    async cancelRefundRequest(userId: string, clientId: string, body: CancelOrderRefundRequestDto) {
        const { note, orderId, requestId } = body;

        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isOwn = await this.orderBaseService.isOwn(orderId, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }

        await this.orderRefundRequestService.cancelRefundRequest(userId, requestId, orderId);

        await this.orderRefundStateService.addState({
            requestId: requestId,
            state: OrderRefundStatusEnum.CANCELLED,
            userId,
            note,
        });

        return DataSuccessCodeEnum.OK;
    }

    async receivedRefundRequest(userId: string, requestId: string) {
        const [orderRefundRequest, orderRefundState] = await Promise.all([
            this.orderRefundRequestService.getByRequestId(requestId),
            this.orderRefundStateService.getApprovedState(requestId),
        ]);

        if (orderRefundRequest.status !== OrderRefundRequestStatusEnum.APPROVED || !orderRefundState) {
            throw new BadRequest({ message: DataErrorCodeEnum.REFUND_REQUEST_MUST_APPROVED });
        }

        const order = await this.orderBaseService.get(orderRefundRequest.orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        await Promise.all([
            this.orderRefundRequestService.updateRefundRequest({
                requestId,
                status: OrderRefundRequestStatusEnum.RECEIVED,
                userId,
            }),
            this.orderRefundStateService.addState({
                requestId: requestId,
                state: OrderRefundStatusEnum.RECEIVED,
                userId,
            }),
        ]);

        return DataSuccessCodeEnum.OK;
    }

    async availableState(orderId: string) {
        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isPendingTransaction = await this.orderTransactionService.isTransactionPending(orderId);
        const confirmable =
            order.type === OrderType.SERVICE &&
            (order.status === OrderStatusEnum.PAID_PAYMENT || order.status === OrderStatusEnum.PENDING);

        return {
            cancelable: [...CAN_CANCEL_LIST, OrderStatusEnum.CONFIRMED].includes(order.status) && !isPendingTransaction,
            returnable: CAN_RETURN_LIST.includes(order.status) && order.type === OrderType.PRODUCT,
            receivable: order.type === OrderType.PRODUCT && order.status === OrderStatusEnum.SHIPPED,
            createPayment:
                order.paymentType === OrderPaymentTypeEnum.BANK &&
                order.totalPaid < order.total &&
                order.status === OrderStatusEnum.PENDING_PAYMENT,
            confirmable,
        };
    }
}
