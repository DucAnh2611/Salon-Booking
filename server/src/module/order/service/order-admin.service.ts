import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LOGGER_CONSTANT_NAME } from '../../../common/constant/logger.constant';
import {
    CAN_CANCEL_LIST,
    CAN_FINISH_LIST,
    CAN_NOT_UPDATE_STATE_LIST,
    CAN_RETURN_LIST,
    FAIL_STATE_LIST,
    ORDER_STATE_PRODUCT,
    ORDER_STATE_SERVICE,
} from '../../../common/constant/order.contant';
import { DataErrorCodeEnum } from '../../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../../common/enum/data-success-code.enum';
import {
    OrderPaymentTypeEnum,
    OrderRefundRequestStatusEnum,
    OrderRefundStatusEnum,
    OrderStatusEnum,
    OrderType,
} from '../../../common/enum/order.enum';
import { ShiftEmployeeStatusEnum } from '../../../common/enum/shift.enum';
import { BadRequest } from '../../../shared/exception/error.exception';
import { BankService } from '../../bank/bank.service';
import { AppLoggerService } from '../../logger/logger.service';
import { OrderRefundRequestService } from '../../oder-refund-request/order-refund-request.service';
import { FindOrderAdminDto } from '../../order-base/dto/order-base-get.dto';
import { OrderBaseService } from '../../order-base/order-base.service';
import { OrderProductItemService } from '../../order-product-item/order-product-item.service';
import { OrderRefundStateService } from '../../order-refund-state/order-refund-state.service';
import { OrderServiceItemService } from '../../order-service-item/order-service-item.service';
import { OrderStateService } from '../../order-state/order-state.service';
import { OrderTransactionService } from '../../order-transaction/order-transaction.service';
import { ShiftEmployeeService } from '../../shift-employee/shift-employee.service';
import { UserService } from '../../user/user.service';
import { TrackingDetailOrderDto } from '../dto/order-get.dto';
import {
    ApprovedRefundRequestDto,
    DeclineRefundRequestDto,
    StaffCancelOrderStateDto,
    StaffUpdateOrderStateDto,
} from '../dto/order-update.dto';

@Injectable()
export class OrderAdminService {
    private readonly orderLogger: AppLoggerService = new AppLoggerService(LOGGER_CONSTANT_NAME.cron, 'Order');

    constructor(
        private readonly orderBaseService: OrderBaseService,
        private readonly orderProductItemService: OrderProductItemService,
        private readonly orderServiceItemService: OrderServiceItemService,
        private readonly orderTransactionService: OrderTransactionService,
        private readonly orderStateService: OrderStateService,
        private readonly orderRefundRequestService: OrderRefundRequestService,
        private readonly orderRefundStateService: OrderRefundStateService,
        private readonly userService: UserService,
        private readonly bankService: BankService,
        private readonly shiftEmployeeService: ShiftEmployeeService,
    ) {}

    /** @Order */
    async staffCancelOrder(userId: string, body: StaffCancelOrderStateDto) {
        const { orderId, reason } = body;

        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const { cancelable } = await this.availableActions(orderId);
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
                break;
            default:
                break;
        }

        return DataSuccessCodeEnum.OK;
    }

    async orderList(body: FindOrderAdminDto) {
        const [items, count] = await this.orderBaseService.getOrderAdmin(body);
        const mapInfoItems = await Promise.all(
            items.map(async item => {
                return {
                    ...item,
                };
            }),
        );

        return {
            items: mapInfoItems,
            page: body.page,
            limit: body.limit,
            count,
        };
    }

    async orderProductDetail(id: string) {
        const order = await this.orderBaseService.getAdmin(id);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const availableActions = await this.availableActions(order.id);

        return {
            ...order,
            ...availableActions,
        };
    }

    async orderDetailInfo(detailType: TrackingDetailOrderDto) {
        const { orderId, type } = detailType;
        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
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
                detail = await this.orderTransactionService.getTransactionByOrderAdmin(orderId);
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

    /** @Order_State */
    listOrderState(type: OrderType) {
        let items: OrderStatusEnum[] = [];

        switch (type) {
            case OrderType.PRODUCT:
                items = [...ORDER_STATE_PRODUCT.normal.staff];
                break;
            case OrderType.SERVICE:
                items = [...ORDER_STATE_SERVICE.normal.staff];
                break;
            default:
                break;
        }

        return items;
    }

    async staffUpdateState(userId: string, body: StaffUpdateOrderStateDto) {
        const { orderId, state, description } = body;

        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const staff = await this.userService.getStaff(userId);
        if (!staff) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_CLIENT });
        }

        const stateList = (order.type === OrderType.PRODUCT ? ORDER_STATE_PRODUCT : ORDER_STATE_SERVICE).normal.staff;
        if (!stateList.includes(state)) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_ORDER_STATE });
        }

        if (order.paymentType === OrderPaymentTypeEnum.BANK && !order.paid) {
            throw new BadRequest({ message: DataErrorCodeEnum.ORDER_IS_NOT_PAID });
        }

        await Promise.all([
            this.orderBaseService.updateState(orderId, state, userId),
            this.orderStateService.addState({
                orderId,
                state,
                userId,
                description: description,
            }),
        ]);

        if (order.type === OrderType.SERVICE) {
            switch (state) {
                case OrderStatusEnum.ON_SERVICE:
                    await this.orderOnJob(orderId);
                    break;
                case OrderStatusEnum.FINISH:
                    await this.orderBaseService.updateTotalPaid(orderId, order.total, userId);
                    await this.orderFinish(orderId);
                    break;
                default:
                    break;
            }
        }

        return DataSuccessCodeEnum.OK;
    }

    /** @Order_Refund_Request */
    async createQr(requestId: string) {
        const refundInfo = await this.orderRefundRequestService.getByRequestId(requestId);
        if (!refundInfo) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_REFUND_REQUEST });
        }

        const order = await this.orderBaseService.get(refundInfo.orderId);

        return this.bankService.createQrPayment({
            amount: refundInfo.amount,
            bankAccount: refundInfo.accountBankNumber,
            bankBin: parseInt(refundInfo.accountBankBin),
            bankName: refundInfo.accountBankName,
            desc: `HOAN TIEN DON HANG ${order.code} `,
        });
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
            state: OrderRefundStatusEnum.DECLINE,
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
        const order = await this.orderBaseService.get(orderRefundRequest.orderId);

        const { accountBankBin, accountBankName, accountBankNumber, amount } = orderRefundRequest;

        await Promise.all([
            this.bankService.removeQr(`${accountBankBin}_${accountBankNumber}_${accountBankName}_${amount}`),
            this.orderRefundRequestService.updateRefundRequest({
                requestId,
                status: OrderRefundRequestStatusEnum.APPROVED,
                userId,
            }),
            this.orderRefundStateService.addState({
                requestId: requestId,
                state: OrderRefundStatusEnum.APPROVED,
                bankTransactionCode,
                mediaId,
                mediaUrl,
                note,
                userId,
            }),
        ]);

        return DataSuccessCodeEnum.OK;
    }

    async orderOnJob(orderId: string) {
        const employeeService = await this.orderServiceItemService.getServiceOrder(orderId);

        return Promise.all(
            employeeService.map(emp =>
                this.shiftEmployeeService.updateStatus(emp.employeeId, {
                    shiftId: emp.shiftId,
                    status: ShiftEmployeeStatusEnum.ON_JOB,
                }),
            ),
        );
    }

    async orderFinish(orderId: string) {
        const employeeService = await this.orderServiceItemService.getServiceOrder(orderId);

        return Promise.all(
            employeeService.map(emp =>
                this.shiftEmployeeService.updateStatus(emp.employeeId, {
                    shiftId: emp.shiftId,
                    status: ShiftEmployeeStatusEnum.AVAILABLE,
                }),
            ),
        );
    }

    async availableActions(orderId: string) {
        const order = await this.orderBaseService.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        const updateState = !CAN_NOT_UPDATE_STATE_LIST.includes(order.status);
        const showUnPaid =
            !order.paid &&
            !FAIL_STATE_LIST.includes(order.status) &&
            !CAN_RETURN_LIST.includes(order.status) &&
            !CAN_FINISH_LIST.includes(order.status);

        return {
            updateState,
            showUnPaid,
            cancelable: CAN_CANCEL_LIST.includes(order.status),
        };
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async checkExpiredServiceOrder() {
        const serviceOrders = await this.orderBaseService.getExpiredOrderService();
        if (!serviceOrders.length) return;

        this.orderLogger.info(`Auto cancel ${serviceOrders.length} because of expired confirm date.`);

        await Promise.all(
            serviceOrders.map(order => {
                this.orderBaseService.cancelExpiredOrder(order.id);
                this.orderStateService.addCancelExpired(order.id);
                this.orderTransactionService.cancelTransactionOrderQueue(order.id);
                order.services.map(service =>
                    this.shiftEmployeeService.updateStatus(service.employeeId, {
                        shiftId: service.shiftId,
                        status: ShiftEmployeeStatusEnum.AVAILABLE,
                    }),
                );
            }),
        );
    }
}
