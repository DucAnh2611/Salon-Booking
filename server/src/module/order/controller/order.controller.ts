import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../../common/constant/role.constant';
import { CLIENT_ORDER_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { CreateOrderRefundRequestDto } from '../../oder-refund-request/dto/order-refund-request-create.dto';
import { FindOrderClientDto } from '../../order-base/dto/order-base-get.dto';
import { ReturnUrlTransactionPayOsDto } from '../../order-transaction/dto/order-transaction.get.dto';
import { CreateOrderProductDto, CreateOrderServiceDto } from '../dto/order-create.dto';
import { GetOrderParamDto } from '../dto/order-get.dto';
import { ClientCancelOrderStateDto, UpdateOrderStateDto } from '../dto/order-update.dto';
import { OrderService } from '../order.service';

@UseGuards(AccessTokenGuard, UserTypeGuard)
@Controller(ROUTER.ORDER)
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get(CLIENT_ORDER_ROUTE.TRACKING)
    @UserType(ROLE_TITLE.client)
    tracking(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { clientId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.tracking(orderId, clientId);
    }

    @Post(CLIENT_ORDER_ROUTE.SEARCH)
    @UserType(ROLE_TITLE.client)
    search(@Req() req: AppRequest, @Body() body: FindOrderClientDto) {
        const { clientId } = req.accessPayload;

        return this.orderService.clientList(clientId, body);
    }

    @Post(CLIENT_ORDER_ROUTE.PLACE_PRODUCT)
    @UserType(ROLE_TITLE.client)
    placeOrderProduct(@Req() req: AppRequest, @Body() body: CreateOrderProductDto) {
        const { clientId, userId } = req.accessPayload;
        return this.orderService.createOrderProduct(userId, clientId, body);
    }

    @Post(CLIENT_ORDER_ROUTE.PLACE_SERVICE)
    @UserType(ROLE_TITLE.client)
    placeOrderService(@Req() req: AppRequest, @Body() body: CreateOrderServiceDto) {
        const { clientId, userId } = req.accessPayload;
        return this.orderService.createOrderService(userId, clientId, body);
    }

    @Post(CLIENT_ORDER_ROUTE.CANCEL)
    @UserType(ROLE_TITLE.client)
    cancelOrder(@Req() req: AppRequest, @Body() body: ClientCancelOrderStateDto) {
        const { clientId, userId } = req.accessPayload;

        return this.orderService.clientCancelOrder(userId, clientId, body);
    }

    @Get(CLIENT_ORDER_ROUTE.FAIL_TRANSACTION)
    @UserType(ROLE_TITLE.client)
    cancelTransaction(
        @Req() req: AppRequest,
        @Param() param: GetOrderParamDto,
        @Query() query: ReturnUrlTransactionPayOsDto,
    ) {
        const { clientId, userId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.transactionCancel(userId, clientId, orderId, query);
    }

    @Get(CLIENT_ORDER_ROUTE.SUCCESS_TRANSACTION)
    @UserType(ROLE_TITLE.client)
    successTransaction(
        @Req() req: AppRequest,
        @Param() param: GetOrderParamDto,
        @Query() query: ReturnUrlTransactionPayOsDto,
    ) {
        const { clientId, userId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.transactionCancel(userId, clientId, orderId, query);
    }

    @Get(CLIENT_ORDER_ROUTE.GET_PAYMENT_LINK_PRODUCT)
    @UserType(ROLE_TITLE.client)
    getPaymentLinkProduct(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { clientId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.getPaymentLink(orderId, clientId, 'P');
    }

    @Get(CLIENT_ORDER_ROUTE.GET_PAYMENT_LINK_SERVICE)
    @UserType(ROLE_TITLE.client)
    getPaymentLinkService(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { clientId } = req.accessPayload;
        const { id: orderId } = param;

        return this.orderService.getPaymentLink(orderId, clientId, 'S');
    }

    @Put(CLIENT_ORDER_ROUTE.UPDATE_STATE)
    @UserType(ROLE_TITLE.client)
    receiveProduct(@Req() req: AppRequest, @Param() param: GetOrderParamDto, @Body() body: UpdateOrderStateDto) {
        const { clientId, userId } = req.accessPayload;
        const { id: orderId } = param;
        const { type, state } = body;

        return this.orderService.clientUpdateState(userId, clientId, {
            orderId,
            state,
            type,
        });
    }

    @Post(CLIENT_ORDER_ROUTE.CREATE_REQUEST_REFUND)
    @UserType(ROLE_TITLE.client)
    createRequestRefund(@Req() req: AppRequest, @Body() body: CreateOrderRefundRequestDto) {
        const { clientId, userId } = req.accessPayload;

        return this.orderService.createRefundRequest(userId, clientId, body);
    }

    @Put(CLIENT_ORDER_ROUTE.RECEIVE_REFUND)
    @UserType(ROLE_TITLE.client)
    receivedRefund(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { userId } = req.accessPayload;
        const { id: requestId } = param;

        return this.orderService.receivedRefundRequest(userId, requestId);
    }
}
