import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../common/constant/role.constant';
import { ORDER_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { UserType } from '../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { CreateOrderProductDto, CreateOrderServiceDto } from './dto/order-create.dto';
import { OrderService } from './order.service';

@UseGuards(AccessTokenGuard, UserTypeGuard)
@Controller(ROUTER.ORDER)
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post(ORDER_ROUTE.PRODUCT)
    @UserType(ROLE_TITLE.client)
    placeOrderProduct(@Req() req: AppRequest, @Body() body: CreateOrderProductDto) {
        const { clientId } = req.accessPayload;
        return this.orderService.createOrderProduct(clientId, body);
    }

    @Post(ORDER_ROUTE.PRODUCT)
    @UserType(ROLE_TITLE.client)
    placeOrderService(@Req() req: AppRequest, @Body() body: CreateOrderServiceDto) {
        const { clientId } = req.accessPayload;
        return this.orderService.createOrderService(clientId, body);
    }
}
