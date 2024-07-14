import { Body, Controller, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../../common/constant/role.constant';
import { PRODUCT_DETAIL_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { CreateProductDetailDto } from '../dto/product-detail-create.dto';
import { GetProductDetailParamDto } from '../dto/product-detail-get.dto';
import { UpdateProductDetailDto } from '../dto/product-detail-update.dto';
import { ProductDetailService } from '../product-detail.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@UserType(ROLE_TITLE.staff)
@Controller(ROUTER.PRODUCT_DETAIL)
export class ProductDetailAdminController {
    constructor(private readonly productDetailService: ProductDetailService) {}

    @Post(PRODUCT_DETAIL_ROUTE.CREATE)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.PRODUCT,
            action: [PermissionActionEnum.CREATE],
        },
        {
            target: PermissionTargetEnum.PRODUCT_DETAIL,
            action: [PermissionActionEnum.CREATE],
        },
    ])
    create(@Req() req: AppRequest, @Body() body: CreateProductDetailDto) {
        return this.productDetailService.saveMany(body);
    }

    @Put(PRODUCT_DETAIL_ROUTE.UPDATE)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.PRODUCT,
            action: [PermissionActionEnum.UPDATE],
        },
        {
            target: PermissionTargetEnum.PRODUCT_DETAIL,
            action: [PermissionActionEnum.UPDATE],
        },
    ])
    update(@Req() req: AppRequest, @Body() body: UpdateProductDetailDto) {
        return this.productDetailService.updateList(body);
    }

    @Put(PRODUCT_DETAIL_ROUTE.DELETE_ONE)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.PRODUCT,
            action: [PermissionActionEnum.DELETE],
        },
        {
            target: PermissionTargetEnum.PRODUCT_DETAIL,
            action: [PermissionActionEnum.DELETE],
        },
    ])
    deleteOne(@Param() param: GetProductDetailParamDto) {
        const { id } = param;

        return this.productDetailService.deleteOne(id);
    }
}
