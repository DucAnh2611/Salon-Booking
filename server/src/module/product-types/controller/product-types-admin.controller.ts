import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../../common/constant/role.constant';
import { PRODUCT_TYPES_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { CreateProductTypesDto } from '../dto/product-types-create.dto';
import { UpdateProductTypesDto } from '../dto/product-types-update.dto';
import { ProductTypesService } from '../product-types.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@UserType(ROLE_TITLE.staff)
@Controller(ROUTER.PRODUCT_TYPES)
export class ProductTypesAdminController {
    constructor(private readonly productTypesService: ProductTypesService) {}

    @Post(PRODUCT_TYPES_ROUTE.CREATE)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.PRODUCT,
            action: [PermissionActionEnum.CREATE],
        },
        {
            target: PermissionTargetEnum.PRODUCT_TYPE,
            action: [PermissionActionEnum.CREATE],
        },
    ])
    create(@Req() req: AppRequest, @Body() body: CreateProductTypesDto) {
        const { accessPayload } = req;
        const { employeeId, userId } = accessPayload;

        return this.productTypesService.saveList(userId, employeeId, body);
    }

    @Put(PRODUCT_TYPES_ROUTE.UPDATE)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.PRODUCT,
            action: [PermissionActionEnum.UPDATE],
        },
        {
            target: PermissionTargetEnum.PRODUCT_TYPE,
            action: [PermissionActionEnum.UPDATE],
        },
    ])
    update(@Req() req: AppRequest, @Body() body: UpdateProductTypesDto) {
        const { accessPayload } = req;
        const { employeeId, userId } = accessPayload;

        return this.productTypesService.updateList(userId, employeeId, body);
    }
}
