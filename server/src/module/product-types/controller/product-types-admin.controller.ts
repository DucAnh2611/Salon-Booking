import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PRODUCT_TYPES_ROUTE, ROUTER } from '../../../constant/router.constant';
import { TargetActionRequire } from '../../../decorator/permission.decorator';
import { UserType } from '../../../decorator/user-types.decorator';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../enum/permission.enum';
import { UserTypeEnum } from '../../../enum/user.enum';
import { AccessTokenGuard } from '../../../guard/accessToken.guard';
import { PermissionGuard } from '../../../guard/permission.guard';
import { UserTypeGuard } from '../../../guard/user-type.guard';
import { AppRequest } from '../../../interface/custom-request.interface';
import { CreateProductTypesBodyDto } from '../dto/product-types-create.dto';
import { UpdateProductTypesBodyDto } from '../dto/product-types-update.dto';
import { ProductTypesService } from '../product-types.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.PRODUCT_TYPES)
export class ProductTypesAdminController {
    constructor(private readonly productTypesService: ProductTypesService) {}

    @Post(PRODUCT_TYPES_ROUTE.CREATE)
    @UserType(UserTypeEnum.STAFF)
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
    create(@Req() req: AppRequest, @Body() body: CreateProductTypesBodyDto) {
        const { accessPayload } = req;
        const { employeeId, userId } = accessPayload;

        return this.productTypesService.saveList(userId, employeeId, body);
    }

    @Put(PRODUCT_TYPES_ROUTE.UPDATE)
    @UserType(UserTypeEnum.STAFF)
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
    update(@Req() req: AppRequest, @Body() body: UpdateProductTypesBodyDto) {
        const { accessPayload } = req;
        const { employeeId, userId } = accessPayload;

        return this.productTypesService.updateList(userId, employeeId, body);
    }
}
