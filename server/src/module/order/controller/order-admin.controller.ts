import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ADMIN_ORDER_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { FindOrderAdminDto } from '../../order-base/dto/order-base-get.dto';
import {
    GetJobQueryListDto,
    GetOrderParamDto,
    GetOrderStateListQueryDto,
    GetRequestRefundParamDto,
} from '../dto/order-get.dto';
import {
    ApprovedRefundRequestDto,
    DeclineRefundRequestDto,
    StaffCancelOrderStateDto,
    StaffUpdateOrderStateDto,
} from '../dto/order-update.dto';
import { OrderAdminService } from '../service/order-admin.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.ORDER_STAFF)
export class OrderAdminController {
    constructor(private readonly orderAdminService: OrderAdminService) {}

    @Post(ADMIN_ORDER_ROUTE.LIST)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORDER, action: [PermissionActionEnum.READ] }])
    @UserType(UserTypeEnum.STAFF)
    getOrderProduct(@Body() body: FindOrderAdminDto) {
        return this.orderAdminService.orderList(body);
    }

    @Post(ADMIN_ORDER_ROUTE.CANCEL_KEEP_FEE)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORDER, action: [PermissionActionEnum.UPDATE] }])
    @UserType(UserTypeEnum.STAFF)
    cancelKeepFee(@Req() req: AppRequest, @Body() body: StaffCancelOrderStateDto) {
        const { userId } = req.accessPayload;
        return this.orderAdminService.staffCancelOrder(userId, body);
    }

    @Get(ADMIN_ORDER_ROUTE.DETAIL)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORDER, action: [PermissionActionEnum.READ] }])
    @UserType(UserTypeEnum.STAFF)
    getOrderProductDetail(@Param() param: GetOrderParamDto) {
        const { id } = param;

        return this.orderAdminService.orderProductDetail(id);
    }
    @Get(ADMIN_ORDER_ROUTE.STATE)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORDER, action: [PermissionActionEnum.READ] }])
    @UserType(UserTypeEnum.STAFF)
    trackingState(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { id: orderId } = param;

        return this.orderAdminService.orderDetailInfo({ type: 'state', orderId });
    }

    @Get(ADMIN_ORDER_ROUTE.PRODUCT)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORDER, action: [PermissionActionEnum.READ] }])
    @UserType(UserTypeEnum.STAFF)
    trackingProducts(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { id: orderId } = param;

        return this.orderAdminService.orderDetailInfo({ type: 'product', orderId });
    }

    @Get(ADMIN_ORDER_ROUTE.SERVICE)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORDER, action: [PermissionActionEnum.READ] }])
    @UserType(UserTypeEnum.STAFF)
    trackingServices(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { id: orderId } = param;

        return this.orderAdminService.orderDetailInfo({ type: 'service', orderId });
    }

    @Get(ADMIN_ORDER_ROUTE.REFUND)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORDER, action: [PermissionActionEnum.READ] }])
    @UserType(UserTypeEnum.STAFF)
    trackingRefunds(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { id: orderId } = param;

        return this.orderAdminService.orderDetailInfo({ type: 'refund', orderId });
    }

    @Get(ADMIN_ORDER_ROUTE.TRANSACTION)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORDER, action: [PermissionActionEnum.READ] }])
    @UserType(UserTypeEnum.STAFF)
    trackingTransaction(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { id: orderId } = param;

        return this.orderAdminService.orderDetailInfo({ type: 'transaction', orderId });
    }

    @Get(ADMIN_ORDER_ROUTE.ORDER_STATE_LIST)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORDER, action: [PermissionActionEnum.READ] }])
    @UserType(UserTypeEnum.STAFF)
    orderStateList(@Req() req: AppRequest, @Query() query: GetOrderStateListQueryDto) {
        const { type } = query;

        return this.orderAdminService.listOrderState(type);
    }

    @Get(ADMIN_ORDER_ROUTE.RECHECK_ORDER_REFUND)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORDER, action: [PermissionActionEnum.READ] }])
    @UserType(UserTypeEnum.STAFF)
    recheckOrderRefund(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { id } = param;

        return this.orderAdminService.checkResultRefund(id);
    }

    @Get(ADMIN_ORDER_ROUTE.GET_ORDER_REFUND)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORDER, action: [PermissionActionEnum.READ] }])
    @UserType(UserTypeEnum.STAFF)
    getOrderRefund(@Req() req: AppRequest, @Param() param: GetOrderParamDto) {
        const { id } = param;

        return this.orderAdminService.getRefundRequest(id);
    }

    @Put(ADMIN_ORDER_ROUTE.UPDATE_ORDER_STATE)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORDER, action: [PermissionActionEnum.UPDATE] }])
    @UserType(UserTypeEnum.STAFF)
    updateOrderState(@Req() req: AppRequest, @Body() body: StaffUpdateOrderStateDto) {
        const { userId } = req.accessPayload;

        return this.orderAdminService.staffUpdateState(userId, body);
    }

    @Post(ADMIN_ORDER_ROUTE.APPROVE_ORDER_REFUND)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORDER, action: [PermissionActionEnum.UPDATE] }])
    @UserType(UserTypeEnum.STAFF)
    approveOrderRefund(@Req() req: AppRequest, @Body() body: ApprovedRefundRequestDto) {
        const { userId } = req.accessPayload;

        return this.orderAdminService.approvedRefundRequest(userId, body);
    }

    @Post(ADMIN_ORDER_ROUTE.DECLINE_ORDER_REFUND)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORDER, action: [PermissionActionEnum.UPDATE] }])
    @UserType(UserTypeEnum.STAFF)
    declineOrderRefund(@Req() req: AppRequest, @Body() body: DeclineRefundRequestDto) {
        const { userId } = req.accessPayload;

        return this.orderAdminService.declineRefundRequest(userId, body);
    }

    @Get(ADMIN_ORDER_ROUTE.CREATE_OR_PAYMENT)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORDER, action: [PermissionActionEnum.READ] }])
    @UserType(UserTypeEnum.STAFF)
    createQrPayment(@Req() req: AppRequest, @Param() param: GetRequestRefundParamDto) {
        const { userId } = req.accessPayload;
        const { id } = param;

        return this.orderAdminService.createQr(id);
    }

    @Post(ADMIN_ORDER_ROUTE.MY_JOB)
    @TargetActionRequire([])
    @UserType(UserTypeEnum.STAFF)
    employeeJob(@Req() req: AppRequest, @Body() body: GetJobQueryListDto) {
        const { employeeId } = req.accessPayload;

        return this.orderAdminService.currentJob(employeeId, body);
    }
}
