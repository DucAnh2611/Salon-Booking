import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { PRODUCT_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { DeleteProductBaseDto } from '../../product-base/dto/product-base-delete.dto';
import { FindProductBaseAdminDto, GetProductBaseParamDto } from '../../product-base/dto/product-base-get.dto';
import { CreateProductDto } from '../dto/product-create.dto';
import { UpdateProductDto } from '../dto/product-update.dto';
import { ProductService } from '../service/product.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.PRODUCT)
export class ProductAdminController {
    constructor(private readonly productService: ProductService) {}

    @Get(PRODUCT_ROUTE.FIND)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.PRODUCT, action: [PermissionActionEnum.READ] }])
    find(@Query() query: FindProductBaseAdminDto) {
        return this.productService.findAdmin(query);
    }

    @Get(PRODUCT_ROUTE.DETAIL)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.PRODUCT, action: [PermissionActionEnum.READ] }])
    detail(@Param() query: GetProductBaseParamDto) {
        const { id } = query;

        return this.productService.detail(id);
    }

    @Post(PRODUCT_ROUTE.CREATE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.PRODUCT, action: [PermissionActionEnum.CREATE] }])
    create(@Req() req: AppRequest, @Body() body: CreateProductDto) {
        const { accessPayload } = req;
        const { employeeId, userId } = accessPayload;

        return this.productService.create(userId, employeeId, body);
    }

    @Put(PRODUCT_ROUTE.UPDATE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.PRODUCT, action: [PermissionActionEnum.UPDATE] }])
    update(@Req() req: AppRequest, @Body() body: UpdateProductDto) {
        const { accessPayload } = req;
        const { employeeId, userId } = accessPayload;

        return this.productService.update(userId, employeeId, body);
    }

    @Delete(PRODUCT_ROUTE.DELETE_ONE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.PRODUCT, action: [PermissionActionEnum.DELETE] }])
    deleteOne(@Req() req: AppRequest, @Param() param: GetProductBaseParamDto) {
        const { id } = param;

        return this.productService.delete([id]);
    }

    @Delete(PRODUCT_ROUTE.DELETE_MANY)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.PRODUCT, action: [PermissionActionEnum.DELETE] }])
    deleteMany(@Req() req: AppRequest, @Body() body: DeleteProductBaseDto) {
        const { ids } = body;

        return this.productService.delete(ids);
    }
}
