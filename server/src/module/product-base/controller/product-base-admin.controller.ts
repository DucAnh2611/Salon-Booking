import { Body, Controller, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PRODUCT_BASE_ROUTE, ROUTER } from '../../../constant/router.constant';
import { TargetActionRequire } from '../../../decorator/permission.decorator';
import { UserType } from '../../../decorator/user-types.decorator';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../enum/permission.enum';
import { UserTypeEnum } from '../../../enum/user.enum';
import { AccessTokenGuard } from '../../../guard/accessToken.guard';
import { PermissionGuard } from '../../../guard/permission.guard';
import { UserTypeGuard } from '../../../guard/user-type.guard';
import { AppRequest } from '../../../interface/custom-request.interface';
import { CreateProductBaseDto } from '../dto/product-base-create.dto';
import { GetProductBaseParamDto } from '../dto/product-base-get.dto';
import { UpdateProductBaseDto } from '../dto/product-base-update.dto';
import { ProductBaseService } from '../service/product-base.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.PRODUCT_BASE)
export class ProductBaseAdminController {
    constructor(private readonly productBaseService: ProductBaseService) {}

    @Post(PRODUCT_BASE_ROUTE.CREATE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.PRODUCT,
            action: [PermissionActionEnum.CREATE],
        },
    ])
    async create(@Req() req: AppRequest, @Body() body: CreateProductBaseDto) {
        const { accessPayload } = req;
        const { userId, employeeId } = accessPayload;

        const saved = await this.productBaseService.save(userId, employeeId, body);
        return saved;
    }

    @Put(PRODUCT_BASE_ROUTE.UPDATE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.PRODUCT,
            action: [PermissionActionEnum.UPDATE],
        },
    ])
    async update(@Req() req: AppRequest, @Param() param: GetProductBaseParamDto, @Body() body: UpdateProductBaseDto) {
        const { accessPayload } = req;
        const { id } = param;
        const { userId, employeeId } = accessPayload;

        const saved = await this.productBaseService.update(userId, employeeId, id, body);
        return saved;
    }
}
