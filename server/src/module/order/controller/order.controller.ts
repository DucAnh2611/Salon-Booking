import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CLIENT_ORDER_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { LockStateEnum } from '../../../common/enum/lock-state.enum';
import { OrderStatusEnum } from '../../../common/enum/order.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { NotLockState } from '../../../shared/decorator/not-lock-state.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenClientGuard } from '../../../shared/guard/accessToken.guard';
import { NotLockStateGuard } from '../../../shared/guard/not-lock-state.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import {
    CancelOrderRefundRequestDto,
    CancelTransactionDto,
    CreateOrderRefundRequestDto,
} from '../../oder-refund-request/dto/order-refund-request-create.dto';
import { FindOrderClientDto } from '../../order-base/dto/order-base-get.dto';
import { ReturnUrlTransactionPayOsDto } from '../../order-transaction/dto/order-transaction.get.dto';
import { CreateOrderProductDto, CreateOrderServiceDto } from '../dto/order-create.dto';
import { GetOrderParamDto, GetOrderTrackingParamDto } from '../dto/order-get.dto';
import { ClientCancelOrderStateDto } from '../dto/order-update.dto';
import { OrderService } from '../service/order.service';

@UseGuards(AccessTokenClientGuard, UserTypeGuard, NotLockStateGuard)
@Controller(ROUTER.ORDER)
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get(CLIENT_ORDER_ROUTE.TRACKING)
    @UserType(UserTypeEnum.CLIENT)
    tracking(@Req() req: AppRequest, @Param() param: GetOrderTrackingParamDto) {
        const { clientId } = req.accessPayload;
        const { code } = param;

        return this.orderService.tracking(code, clientId);
    }

    @Get(CLIENT_ORDER_ROUTE.TRACKING_STATE)
    @UserType(UserTypeEnum.CLIENT)
    trackingState(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { clientId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.trackingDetail(clientId, { type: 'state', orderId });
    }

    @Get(CLIENT_ORDER_ROUTE.TRACKING_PRODUCT)
    @UserType(UserTypeEnum.CLIENT)
    trackingProducts(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { clientId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.trackingDetail(clientId, { type: 'product', orderId });
    }

    @Get(CLIENT_ORDER_ROUTE.TRACKING_SERVICE)
    @UserType(UserTypeEnum.CLIENT)
    trackingServices(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { clientId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.trackingDetail(clientId, { type: 'service', orderId });
    }

    @Get(CLIENT_ORDER_ROUTE.TRACKING_REFUND)
    @UserType(UserTypeEnum.CLIENT)
    trackingRefunds(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { clientId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.trackingDetail(clientId, { type: 'refund', orderId });
    }

    @Get(CLIENT_ORDER_ROUTE.TRACKING_TRANSACTION)
    @UserType(UserTypeEnum.CLIENT)
    trackingTransaction(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { clientId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.trackingDetail(clientId, { type: 'transaction', orderId });
    }

    @Post(CLIENT_ORDER_ROUTE.SEARCH)
    @UserType(UserTypeEnum.CLIENT)
    search(@Req() req: AppRequest, @Body() body: FindOrderClientDto) {
        const { clientId } = req.accessPayload;

        return this.orderService.clientList(clientId, body);
    }

    @Post(CLIENT_ORDER_ROUTE.PLACE_PRODUCT)
    @UserType(UserTypeEnum.CLIENT)
    @NotLockState([LockStateEnum.ORDER])
    placeOrderProductSchema(@Req() req: AppRequest, @Body() body: CreateOrderProductDto) {
        const { clientId, userId } = req.accessPayload;
        return this.orderService.createOrderProduct(userId, clientId, body);
    }

    @Post(CLIENT_ORDER_ROUTE.PLACE_SERVICE)
    @UserType(UserTypeEnum.CLIENT)
    @NotLockState([LockStateEnum.ORDER])
    placeOrderService(@Req() req: AppRequest, @Body() body: CreateOrderServiceDto) {
        const { clientId, userId } = req.accessPayload;
        return this.orderService.createOrderService(userId, clientId, body);
    }

    @Get(CLIENT_ORDER_ROUTE.CONFIRM_ORDER_SERVICE)
    @UserType(UserTypeEnum.CLIENT)
    confirmOrderService(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { clientId, userId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.clientConfirmOrder(userId, clientId, orderId);
    }

    @Get(CLIENT_ORDER_ROUTE.FAIL_TRANSACTION)
    @UserType(UserTypeEnum.CLIENT)
    failTransaction(
        @Req() req: AppRequest,
        @Param() param: GetOrderParamDto,
        @Query() query: ReturnUrlTransactionPayOsDto,
    ) {
        const { clientId, userId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.transactionFail(userId, clientId, orderId, query);
    }

    @Get(CLIENT_ORDER_ROUTE.SUCCESS_TRANSACTION)
    @UserType(UserTypeEnum.CLIENT)
    successTransaction(
        @Req() req: AppRequest,
        @Param() param: GetOrderParamDto,
        @Query() query: ReturnUrlTransactionPayOsDto,
    ) {
        const { clientId, userId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.transactionSuccessfull(userId, clientId, orderId, query);
    }

    @Post(CLIENT_ORDER_ROUTE.CANCEL_TRANSACTION)
    @UserType(UserTypeEnum.CLIENT)
    cancelTransaction(@Req() req: AppRequest, @Param() param: GetOrderParamDto, @Body() body: CancelTransactionDto) {
        const { clientId, userId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.cancelTranscation(userId, clientId, orderId, body);
    }

    @Get(CLIENT_ORDER_ROUTE.GET_PAYMENT_LINK_PRODUCT)
    @UserType(UserTypeEnum.CLIENT)
    getPaymentLinkProduct(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { clientId, userId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.getPaymentLink(orderId, userId, clientId, 'P');
    }

    @Get(CLIENT_ORDER_ROUTE.GET_PAYMENT_LINK_SERVICE)
    @UserType(UserTypeEnum.CLIENT)
    getPaymentLinkService(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { clientId, userId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.getPaymentLink(orderId, userId, clientId, 'S');
    }

    @Post(CLIENT_ORDER_ROUTE.CANCEL_ORDER)
    @UserType(UserTypeEnum.CLIENT)
    cancelOrder(@Req() req: AppRequest, @Body() body: ClientCancelOrderStateDto) {
        const { clientId, userId } = req.accessPayload;

        return this.orderService.clientCancelOrder(userId, clientId, body);
    }

    @Post(CLIENT_ORDER_ROUTE.RECEIVE_ORDER)
    @UserType(UserTypeEnum.CLIENT)
    receiveOrder(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { clientId, userId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.clientUpdateState(userId, clientId, {
            orderId,
            state: OrderStatusEnum.RECEIVED,
        });
    }

    @Post(CLIENT_ORDER_ROUTE.RETURN_ORDER)
    @UserType(UserTypeEnum.CLIENT)
    returnOrder(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { clientId, userId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.clientUpdateState(userId, clientId, {
            orderId,
            state: OrderStatusEnum.RETURNED,
        });
    }

    @Post(CLIENT_ORDER_ROUTE.CREATE_REQUEST_REFUND)
    @UserType(UserTypeEnum.CLIENT)
    createRequestRefund(@Req() req: AppRequest, @Body() body: CreateOrderRefundRequestDto) {
        const { clientId, userId } = req.accessPayload;

        return this.orderService.createRefundRequest(userId, clientId, body);
    }

    @Post(CLIENT_ORDER_ROUTE.CANCEL_REQUEST_REFUND)
    @UserType(UserTypeEnum.CLIENT)
    cancelRequestRefund(@Req() req: AppRequest, @Body() body: CancelOrderRefundRequestDto) {
        const { clientId, userId } = req.accessPayload;

        return this.orderService.cancelRefundRequest(userId, clientId, body);
    }

    @Post(CLIENT_ORDER_ROUTE.RECEIVE_REFUND)
    @UserType(UserTypeEnum.CLIENT)
    receivedRefund(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { userId } = req.accessPayload;
        const { id: requestId } = param;

        return this.orderService.receivedRefundRequest(userId, requestId);
    }
}
