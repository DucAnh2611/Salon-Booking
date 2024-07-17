import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../common/constant/role.constant';
import { CART_SERVICE_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { UserType } from '../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { CreateCartServiceItemDto } from '../cart-service-item/dto/cart-service-item-create.dto';
import { GetCartServiceItemParamDto } from '../cart-service-item/dto/cart-service-item-get.dto';
import { CartServiceService } from './cart-service.service';

@UseGuards(AccessTokenGuard, UserTypeGuard)
@UserType(ROLE_TITLE.client)
@Controller(ROUTER.CART_SERVICE)
export class CartServiceController {
    constructor(private readonly cartServiceService: CartServiceService) {}

    @Get(CART_SERVICE_ROUTE.GET)
    get(@Req() req: AppRequest) {
        const { clientId } = req.accessPayload;

        return this.cartServiceService.get(clientId);
    }

    @Post(CART_SERVICE_ROUTE.ADD)
    add(@Req() req: AppRequest, @Body() body: CreateCartServiceItemDto) {
        const { clientId } = req.accessPayload;

        return this.cartServiceService.add(clientId, body);
    }

    @Delete(CART_SERVICE_ROUTE.DELETE)
    deleteOne(@Req() req: AppRequest, @Param() param: GetCartServiceItemParamDto) {
        const { clientId } = req.accessPayload;
        const { id } = param;

        return this.cartServiceService.delete(clientId, id);
    }
}
