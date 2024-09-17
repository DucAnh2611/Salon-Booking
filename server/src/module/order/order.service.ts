import { Injectable } from '@nestjs/common';
import { ORDER_STATE_PRODUCT, ORDER_STATE_SERVICE } from '../../common/constant/order.contant';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import {
    OrderPaymentStatusEnum,
    OrderPaymentTypeEnum,
    OrderRefundRequestStatusEnum,
    OrderRefundStatusEnum,
    OrderStatusEnum,
    OrderType,
} from '../../common/enum/order.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { CartProductService } from '../cart-product/cart-product.service';
import { CartServiceService } from '../cart-service/cart-service.service';
import { CreateOrderRefundRequestDto } from '../oder-refund-request/dto/order-refund-request-create.dto';
import { OrderRefundRequestService } from '../oder-refund-request/order-refund-request.service';
import { FindOrderClientDto } from '../order-base/dto/order-base-get.dto';
import { OrderBaseService } from '../order-base/order-base.service';
import { OrderProductItemService } from '../order-product-item/order-product-item.service';
import { OrderRefundStateService } from '../order-refund-state/order-refund-state.service';
import { OrderServiceItemService } from '../order-service-item/order-service-item.service';
import { OrderStateService } from '../order-state/order-state.service';
import { ReturnUrlTransactionPayOsDto } from '../order-transaction/dto/order-transaction.get.dto';
import { OrderTransactionService } from '../order-transaction/order-transaction.service';
import { UserService } from '../user/user.service';
import { CreateOrderProductDto, CreateOrderRefundRequestAdminDto, CreateOrderServiceDto } from './dto/order-create.dto';
import { TrackingDetailOrderDto } from './dto/order-get.dto';
import {
    ApprovedRefundRequestDto,
    ClientCancelOrderStateDto,
    ClientUpdateOrderStateDto,
    DeclineRefundRequestDto,
    StaffCancelOrderStateDto,
} from './dto/order-update.dto';

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
        private readonly userService: UserService,
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

        return order;
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

        const [_aProduct, _aState, _rmCart] = await Promise.all([
            this.orderProductItemService.create(newOrder.id, products),
            this.orderStateService.addState({
                userId,
                orderId: newOrder.id,
                state: OrderStatusEnum.CONFIRMED,
            }),
            this.cartProductService.removeCartItems(
                clientId,
                products.map(productItem => productItem.itemId),
            ),
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

        const [_aServices, _aState, _rmCart] = await Promise.all([
            this.orderServiceItemService.add(newOrder.id, services),
            this.orderStateService.addState({
                userId,
                orderId: newOrder.id,
                state: OrderStatusEnum.CONFIRMED,
            }),
            this.cartServiceService.removeCart(clientId),
        ]);
        return newOrder;
    }

    async clientCancelOrder(userId: string, clientId: string, body: ClientCancelOrderStateDto) {
        const { orderId, reason, bankBin, accountName, accountNumber } = body;

        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isOwn = await this.orderBaseService.isOwn(orderId, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }

        const canCancel = await this.orderStateService.canCancel(orderId);
        if (!canCancel) {
            throw new BadRequest({ message: DataErrorCodeEnum.CAN_NOT_CANCEL_ORDER });
        }
        if (order.paymentType === OrderPaymentTypeEnum.BANK) {
            if (order.paid) {
                const orderTransaction = await this.orderTransactionService.getTransactionByOrderAdmin(orderId);
                const paidOrder = orderTransaction.find(
                    transaction => transaction.status === OrderPaymentStatusEnum.PAID,
                );
                if (!paidOrder) {
                    throw new BadRequest({ message: DataErrorCodeEnum.ORDER_IS_NOT_PAID });
                }

                if (bankBin && accountName && accountNumber) {
                    await this.orderRefundRequestService.initRefundRequest(userId, {
                        orderId,
                        transactionId: paidOrder.id,
                        amount: paidOrder.paidAmount,
                        accountBankBin: bankBin,
                        accountName: accountName,
                        accountNumber: accountNumber,
                    });
                } else if (
                    !paidOrder.buyerAccountBankBin ||
                    !paidOrder.buyerAccountName ||
                    !paidOrder.buyerAccountNumber
                ) {
                    await this.orderRefundRequestService.initRefundRequest(userId, {
                        orderId,
                        amount: paidOrder.paidAmount,
                        accountBankBin: paidOrder.buyerAccountBankBin,
                        accountName: paidOrder.buyerAccountName,
                        accountNumber: paidOrder.buyerAccountNumber,
                    });
                } else {
                    throw new BadRequest({ message: DataErrorCodeEnum.MISSING_ORDER_REFUND_BANK_INFO });
                }
            } else {
                const pendingTransaction = await this.orderTransactionService.isTransactionPending(orderId);

                //logic: get pedning transaction  -> get paid amount (not finish) -> create caneltransaction
                // if paid amount is not 0 so create refund request to user
                if (pendingTransaction) {
                    //TODO - update logic for case: paid x% of bill then cancel
                    await this.orderTransactionService.cancelTransaction(
                        pendingTransaction.id,
                        pendingTransaction.paidAmount,
                    );
                }
            }
        }

        await this.orderBaseService.updateState(orderId, OrderStatusEnum.CANCELLED, userId);
        await this.orderStateService.addState({
            orderId,
            state: OrderStatusEnum.CANCELLED,
            description: reason,
            userId,
        });
        return DataSuccessCodeEnum.OK;
    }

    async staffCancelOrder(userId: string, body: StaffCancelOrderStateDto) {
        const { orderId, reason } = body;

        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }
        if (order.paymentType === OrderPaymentTypeEnum.BANK) {
            if (order.paid) {
                const orderTransaction = await this.orderTransactionService.getTransactionByOrderAdmin(orderId);
                const paidOrder = orderTransaction.find(
                    transaction => transaction.status === OrderPaymentStatusEnum.PAID,
                );
                if (!paidOrder) {
                    throw new BadRequest({ message: DataErrorCodeEnum.ORDER_IS_NOT_PAID });
                }

                if (!paidOrder.buyerAccountBankBin || !paidOrder.buyerAccountName || !paidOrder.buyerAccountNumber) {
                    throw new BadRequest({ message: DataErrorCodeEnum.MISSING_ORDER_REFUND_BANK_INFO });
                }
                await this.orderRefundRequestService.initRefundRequest(userId, {
                    orderId,
                    amount: paidOrder.paidAmount,
                    accountBankBin: paidOrder.buyerAccountBankBin,
                    accountName: paidOrder.buyerAccountName,
                    accountNumber: paidOrder.buyerAccountNumber,
                });
            } else {
                //logic: get pedning transaction  -> get paid amount (not finish) -> create caneltransaction
                // if paid amount is not 0 so create refund request to user
                const pendingTransaction = await this.orderTransactionService.isTransactionPending(orderId);
                //TODO - update logic for case: paid x% of bill then cancel
                if (pendingTransaction) {
                    await this.orderTransactionService.cancelTransaction(pendingTransaction.id, order.totalPaid);
                }
            }
        }

        await this.orderBaseService.updateState(orderId, OrderStatusEnum.CANCELLED, userId);
        await this.orderStateService.addState({
            orderId,
            state: OrderStatusEnum.CANCELLED,
            description: reason,
            userId,
        });

        return DataSuccessCodeEnum.OK;
    }

    /** @Order_Transaction */
    async getPaymentLink(orderId: string, clientId: string, type: 'P' | 'S') {
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
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isOwn = await this.orderBaseService.isOwn(orderId, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }

        const paymentInfo = await this.orderTransactionService.getTransactionState(returnBody.id);
        if (!paymentInfo) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PAYMENT_TRANSACTION });
        }

        const pendingTransaction = await this.orderTransactionService.isTransactionPending(orderId);
        if (!pendingTransaction) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER_TRANSACTION });
        }

        if (paymentInfo.amountPaid >= order.total - order.totalPaid) {
            await this.orderBaseService.paidSuccessfull(userId, orderId);
        }

        const [_udpateRemain, updateTransaction] = await Promise.all([
            this.orderBaseService.updateTotalPaid(order.id, order.totalPaid + paymentInfo.amountPaid, userId),
            this.orderTransactionService.updateTransaction(pendingTransaction.id, {
                paidAmount: paymentInfo.amountPaid,
                status: OrderPaymentStatusEnum.PAID,
                paymentTransactions: paymentInfo.transactions,
            }),
        ]);

        return updateTransaction;
    }

    async transactionCancel(
        userId: string,
        clientId: string,
        orderId: string,
        returnBody: ReturnUrlTransactionPayOsDto,
    ) {
        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const isOwn = await this.orderBaseService.isOwn(orderId, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }

        const paymentInfo = await this.orderTransactionService.getTransactionState(returnBody.id);
        if (!paymentInfo) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PAYMENT_TRANSACTION });
        }

        const pendingTransaction = await this.orderTransactionService.isTransactionPending(orderId);
        if (!pendingTransaction) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER_TRANSACTION });
        }

        const [_udpateRemain, cancelTransaction] = await Promise.all([
            this.orderBaseService.updateTotalPaid(order.id, order.totalPaid + paymentInfo.amountPaid, userId),
            this.orderTransactionService.updateTransaction(pendingTransaction.id, {
                paidAmount: paymentInfo.amountPaid,
                paymentTransactions: paymentInfo.transactions,
            }),
        ]);

        return cancelTransaction;
    }

    /** @Order_State */
    async clientUpdateState(userId: string, clientId: string, body: ClientUpdateOrderStateDto) {
        const { orderId, state, type } = body;

        const clientInfo = await this.userService.getClient(userId);
        if (!clientInfo) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_CLIENT });
        }

        const isOwn = await this.orderBaseService.isOwn(orderId, clientId);
        if (!isOwn) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_FORBIDDEN });
        }

        const stateList = (type === OrderType.PRODUCT ? ORDER_STATE_PRODUCT : ORDER_STATE_SERVICE).normal.client;

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

    async staffUpdateState(userId: string, body: ClientUpdateOrderStateDto) {
        const { orderId, state, type } = body;

        const staff = await this.userService.getStaff(userId);
        if (!staff) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_CLIENT });
        }

        const stateList = (type === OrderType.PRODUCT ? ORDER_STATE_PRODUCT : ORDER_STATE_SERVICE).normal.staff;

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

        if (order.totalPaid <= order.total) {
            throw new BadRequest({ message: DataErrorCodeEnum.FULFULLIED_PAID_AMOUNT });
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

    async createRefundRequestAdmin(userId: string, body: CreateOrderRefundRequestAdminDto) {
        const { orderId, accountBankBin, accountName, accountNumber, amount } = body;
        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const refundRequest = await this.orderRefundRequestService.initRefundRequest(userId, {
            orderId,
            accountBankBin,
            accountName,
            accountNumber,
            amount,
        });

        await this.orderRefundStateService.addState({
            requestId: refundRequest.id,
            state: OrderRefundStatusEnum.PENDING,
            userId,
        });

        return refundRequest;
    }

    async declineRefundRequest(userId: string, body: DeclineRefundRequestDto) {
        const { note, requestId } = body;

        const [orderRefundRequest] = await Promise.all([this.orderRefundRequestService.getByRequestId(requestId)]);

        if (orderRefundRequest.status !== OrderRefundRequestStatusEnum.PENDING) {
            throw new BadRequest({ message: DataErrorCodeEnum.REFUND_REQUEST_MUST_BE_PENDING });
        }

        await this.orderRefundRequestService.updateRefundRequest({
            requestId,
            status: OrderRefundRequestStatusEnum.DECLINE,
            userId,
        });

        await this.orderRefundStateService.addState({
            requestId: requestId,
            state: OrderRefundStatusEnum.PENDING,
            userId,
            note,
        });

        return DataSuccessCodeEnum.OK;
    }

    async approvedRefundRequest(userId: string, body: ApprovedRefundRequestDto) {
        const { requestId, bankTransactionCode, mediaUrl, mediaId, note } = body;

        const [orderRefundRequest] = await Promise.all([this.orderRefundRequestService.getByRequestId(requestId)]);

        if (orderRefundRequest.status !== OrderRefundRequestStatusEnum.PENDING) {
            throw new BadRequest({ message: DataErrorCodeEnum.REFUND_REQUEST_MUST_BE_PENDING });
        }

        await this.orderRefundRequestService.updateRefundRequest({
            requestId,
            status: OrderRefundRequestStatusEnum.APPROVED,
            userId,
        });

        await this.orderRefundStateService.addState({
            requestId: requestId,
            state: OrderRefundStatusEnum.APPROVED,
            bankTransactionCode,
            mediaId,
            mediaUrl,
            note,
            userId,
        });

        return DataSuccessCodeEnum.OK;
    }

    async receivedRefundRequest(userId: string, requestId: string) {
        const [orderRefundRequest, orderRefundState] = await Promise.all([
            this.orderRefundRequestService.getByRequestId(requestId),
            this.orderRefundStateService.getByRequestId(requestId),
        ]);

        if (
            orderRefundRequest.status !== OrderRefundRequestStatusEnum.APPROVED ||
            !orderRefundState.find(state => state.status === OrderRefundStatusEnum.APPROVED)
        ) {
            throw new BadRequest({ message: DataErrorCodeEnum.REFUND_REQUEST_MUST_APPROVED });
        }

        await this.orderRefundRequestService.updateRefundRequest({
            requestId,
            status: OrderRefundRequestStatusEnum.RECEIVED,
            userId,
        });

        await this.orderRefundStateService.addState({
            requestId: requestId,
            state: OrderRefundStatusEnum.RECEIVED,
            userId,
        });

        return DataSuccessCodeEnum.OK;
    }
}
