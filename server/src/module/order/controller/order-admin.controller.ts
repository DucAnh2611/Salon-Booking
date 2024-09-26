import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../../common/constant/role.constant';
import { ADMIN_ORDER_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { FindOrderAdminDto } from '../../order-base/dto/order-base-get.dto';
import { GetOrderParamDto, GetOrderStateListQueryDto, GetRequestRefundParamDto } from '../dto/order-get.dto';
import { ApprovedRefundRequestDto, DeclineRefundRequestDto, StaffUpdateOrderStateDto } from '../dto/order-update.dto';
import { OrderAdminService } from '../service/order-admin.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.ORDER_STAFF)
export class OrderAdminController {
    constructor(private readonly orderAdminService: OrderAdminService) {}

    @Post(ADMIN_ORDER_ROUTE.LIST)
    @TargetActionRequire([])
    @UserType(ROLE_TITLE.staff)
    getOrderProduct(@Body() body: FindOrderAdminDto) {
        return this.orderAdminService.orderList(body);
    }

    @Get(ADMIN_ORDER_ROUTE.DETAIL)
    @TargetActionRequire([])
    @UserType(ROLE_TITLE.staff)
    getOrderProductDetail(@Param() param: GetOrderParamDto) {
        const { id } = param;

        return this.orderAdminService.orderProductDetail(id);
    }
    @Get(ADMIN_ORDER_ROUTE.STATE)
    @TargetActionRequire([])
    @UserType(ROLE_TITLE.staff)
    trackingState(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { id: orderId } = param;

        return this.orderAdminService.orderDetailInfo({ type: 'state', orderId });
    }

    @Get(ADMIN_ORDER_ROUTE.PRODUCT)
    @TargetActionRequire([])
    @UserType(ROLE_TITLE.staff)
    trackingProducts(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { id: orderId } = param;

        return this.orderAdminService.orderDetailInfo({ type: 'product', orderId });
    }

    @Get(ADMIN_ORDER_ROUTE.SERVICE)
    @TargetActionRequire([])
    @UserType(ROLE_TITLE.staff)
    trackingServices(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { id: orderId } = param;

        return this.orderAdminService.orderDetailInfo({ type: 'service', orderId });
    }

    @Get(ADMIN_ORDER_ROUTE.REFUND)
    @TargetActionRequire([])
    @UserType(ROLE_TITLE.staff)
    trackingRefunds(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { id: orderId } = param;

        return this.orderAdminService.orderDetailInfo({ type: 'refund', orderId });
    }

    @Get(ADMIN_ORDER_ROUTE.TRANSACTION)
    @TargetActionRequire([])
    @UserType(ROLE_TITLE.staff)
    trackingTransaction(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { id: orderId } = param;

        return this.orderAdminService.orderDetailInfo({ type: 'transaction', orderId });
    }

    @Get(ADMIN_ORDER_ROUTE.ORDER_STATE_LIST)
    @TargetActionRequire([])
    @UserType(ROLE_TITLE.staff)
    orderStateList(@Req() req: AppRequest, @Query() query: GetOrderStateListQueryDto) {
        const { type } = query;

        return this.orderAdminService.listOrderState(type);
    }

    @Put(ADMIN_ORDER_ROUTE.UPDATE_ORDER_STATE)
    @TargetActionRequire([])
    @UserType(ROLE_TITLE.staff)
    updateOrderState(@Req() req: AppRequest, @Body() body: StaffUpdateOrderStateDto) {
        const { userId } = req.accessPayload;

        return this.orderAdminService.staffUpdateState(userId, body);
    }

    @Post(ADMIN_ORDER_ROUTE.APPROVE_ORDER_REFUND)
    @TargetActionRequire([])
    @UserType(ROLE_TITLE.staff)
    approveOrderRefund(@Req() req: AppRequest, @Body() body: ApprovedRefundRequestDto) {
        const { userId } = req.accessPayload;

        return this.orderAdminService.approvedRefundRequest(userId, body);
    }

    @Post(ADMIN_ORDER_ROUTE.DECLINE_ORDER_REFUND)
    @TargetActionRequire([])
    @UserType(ROLE_TITLE.staff)
    declineOrderRefund(@Req() req: AppRequest, @Body() body: DeclineRefundRequestDto) {
        const { userId } = req.accessPayload;

        return this.orderAdminService.declineRefundRequest(userId, body);
    }

    @Get(ADMIN_ORDER_ROUTE.CREATE_OR_PAYMENT)
    @TargetActionRequire([])
    @UserType(ROLE_TITLE.staff)
    createQrPayment(@Req() req: AppRequest, @Param() param: GetRequestRefundParamDto) {
        const { userId } = req.accessPayload;
        const { id } = param;

        return this.orderAdminService.createQr(id);
    }
}
