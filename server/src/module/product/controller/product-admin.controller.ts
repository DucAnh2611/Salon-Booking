import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../../common/constant/role.constant';
import { PRODUCT_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { CreateProductDto } from '../dto/product-create.dto';
import { UpdateProductDto } from '../dto/product-update.dto';
import { ProductService } from '../product.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@UserType(ROLE_TITLE.staff)
@Controller(ROUTER.PRODUCT)
export class ProductAdminController {
    constructor(private readonly productService: ProductService) {}

    @Post(PRODUCT_ROUTE.CREATE)
    @TargetActionRequire([{ target: PermissionTargetEnum.PRODUCT, action: [PermissionActionEnum.CREATE] }])
    create(@Req() req: AppRequest, @Body() body: CreateProductDto) {
        const { accessPayload } = req;
        const { employeeId, userId } = accessPayload;

        return this.productService.create(userId, employeeId, body);
    }

    @Post(PRODUCT_ROUTE.UPDATE)
    @TargetActionRequire([{ target: PermissionTargetEnum.PRODUCT, action: [PermissionActionEnum.CREATE] }])
    update(@Req() req: AppRequest, @Body() body: UpdateProductDto) {
        const { accessPayload } = req;
        const { employeeId, userId } = accessPayload;

        return this.productService.update(userId, employeeId, body);
    }
}
