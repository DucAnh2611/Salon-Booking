import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CART_PRODUCT_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { UserTypeEnum } from '../../common/enum/user.enum';
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
    @UserType(UserTypeEnum.CLIENT)
    get(@Req() req: AppRequest) {
        const { clientId } = req.accessPayload;

        return this.cartProductService.get(clientId);
    }

    @Get(CART_PRODUCT_ROUTE.COUNT)
    @UserType(UserTypeEnum.CLIENT)
    count(@Req() req: AppRequest) {
        const { clientId } = req.accessPayload;

        return this.cartProductService.count(clientId);
    }

    @Post(CART_PRODUCT_ROUTE.CART_AMOUNT)
    @UserType(UserTypeEnum.CLIENT)
    cartAmount(@Req() req: AppRequest, @Body() body: GetCartProductAmountDto) {
        const { clientId } = req.accessPayload;

        return this.cartProductService.calculateAmount(clientId, body);
    }

    @Post(CART_PRODUCT_ROUTE.ADD)
    @UserType(UserTypeEnum.CLIENT)
    add(@Req() req: AppRequest, @Body() body: CreateCartProductItemDto) {
        const { clientId } = req.accessPayload;
        return this.cartProductService.add(clientId, body);
    }

    @Put(CART_PRODUCT_ROUTE.UPDATE)
    @UserType(UserTypeEnum.CLIENT)
    update(@Req() req: AppRequest, @Body() body: UpdateCartProductItemDto) {
        const { clientId } = req.accessPayload;

        return this.cartProductService.update(clientId, body);
    }

    @Delete(CART_PRODUCT_ROUTE.DELETE)
    @UserType(UserTypeEnum.CLIENT)
    delete(@Req() req: AppRequest, @Param() param: GetCartProductParamDto) {
        const { clientId } = req.accessPayload;
        const { id } = param;

        return this.cartProductService.remove(clientId, id);
    }
}
