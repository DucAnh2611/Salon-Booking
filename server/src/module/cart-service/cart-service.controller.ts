import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CART_SERVICE_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { UserTypeEnum } from '../../common/enum/user.enum';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { UserType } from '../../shared/decorator/user-types.decorator';
import { AccessTokenClientGuard } from '../../shared/guard/accessToken.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { CreateCartServiceItemDto } from '../cart-service-item/dto/cart-service-item-create.dto';
import {
    GetCartServiceAmountDto,
    GetCartServiceItemParamDto,
} from '../cart-service-item/dto/cart-service-item-get.dto';
import { CartServiceService } from './cart-service.service';

@UseGuards(AccessTokenClientGuard, UserTypeGuard)
@Controller(ROUTER.CART_SERVICE)
export class CartServiceController {
    constructor(private readonly cartServiceService: CartServiceService) {}

    @Get(CART_SERVICE_ROUTE.GET)
    @UserType(UserTypeEnum.CLIENT)
    get(@Req() req: AppRequest) {
        const { clientId } = req.accessPayload;

        return this.cartServiceService.get(clientId);
    }

    @Post(CART_SERVICE_ROUTE.CART_AMOUNT)
    @UserType(UserTypeEnum.CLIENT)
    getCartAmount(@Req() req: AppRequest, @Body() body: GetCartServiceAmountDto) {
        const { clientId } = req.accessPayload;

        return this.cartServiceService.calculateAmount(clientId, body);
    }

    @Post(CART_SERVICE_ROUTE.ADD)
    @UserType(UserTypeEnum.CLIENT)
    add(@Req() req: AppRequest, @Body() body: CreateCartServiceItemDto) {
        const { clientId } = req.accessPayload;

        return this.cartServiceService.add(clientId, body);
    }

    @Delete(CART_SERVICE_ROUTE.DELETE)
    @UserType(UserTypeEnum.CLIENT)
    deleteOne(@Req() req: AppRequest, @Param() param: GetCartServiceItemParamDto) {
        const { clientId } = req.accessPayload;
        const { id } = param;

        return this.cartServiceService.delete(clientId, id);
    }
}
