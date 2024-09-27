import { Body, Controller, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PRODUCT_BASE_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
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
