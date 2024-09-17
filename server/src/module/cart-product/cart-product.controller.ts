import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../common/constant/role.constant';
import { CART_PRODUCT_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { UserType } from '../../shared/decorator/user-types.decorator';
import { AccessTokenClientGuard } from '../../shared/guard/accessToken.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { CreateCartProductItemDto } from '../cart-product-item/dto/cart-product-item-create.dto';
import { GetCartProductAmountDto, GetCartProductParamDto } from '../cart-product-item/dto/cart-product-item-get.dto';
import { UpdateCartProductItemDto } from '../cart-product-item/dto/cart-product-item-update.dto';
import { CartProductService } from './cart-product.service';

@UseGuards(AccessTokenClientGuard, UserTypeGuard)
@Controller(ROUTER.CART_PRODUCT)
export class CartProductController {
    constructor(private readonly cartProductService: CartProductService) {}

    @Get(CART_PRODUCT_ROUTE.GET)
    @UserType(ROLE_TITLE.client)
    get(@Req() req: AppRequest) {
        const { clientId } = req.accessPayload;

        return this.cartProductService.get(clientId);
    }

    @Post(CART_PRODUCT_ROUTE.CART_AMOUNT)
    @UserType(ROLE_TITLE.client)
    cartAmount(@Req() req: AppRequest, @Body() body: GetCartProductAmountDto) {
        const { clientId } = req.accessPayload;

        return this.cartProductService.calculateAmount(clientId, body);
    }

    @Post(CART_PRODUCT_ROUTE.ADD)
    @UserType(ROLE_TITLE.client)
    add(@Req() req: AppRequest, @Body() body: CreateCartProductItemDto) {
        const { clientId } = req.accessPayload;
        return this.cartProductService.add(clientId, body);
    }

    @Put(CART_PRODUCT_ROUTE.UPDATE)
    @UserType(ROLE_TITLE.client)
    update(@Req() req: AppRequest, @Body() body: UpdateCartProductItemDto) {
        const { clientId } = req.accessPayload;

        return this.cartProductService.update(clientId, body);
    }

    @Delete(CART_PRODUCT_ROUTE.DELETE)
    @UserType(ROLE_TITLE.client)
    delete(@Req() req: AppRequest, @Param() param: GetCartProductParamDto) {
        const { clientId } = req.accessPayload;
        const { id } = param;

        return this.cartProductService.remove(clientId, id);
    }
}
