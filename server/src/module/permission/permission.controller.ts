import { Controller, Get, UseGuards } from '@nestjs/common';
import { PERMISSION_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../common/enum/permission.enum';
import { TargetActionRequire } from '../../shared/decorator/permission.decorator';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { PermissionService } from './permission.service';

@UseGuards(AccessTokenGuard, PermissionGuard)
@Controller(ROUTER.PERMISSION)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Get(PERMISSION_ROUTE.ALL)
    @TargetActionRequire([{ target: PermissionTargetEnum.PERMISSION, action: [PermissionActionEnum.READ] }])
    async getAll() {
        const items = await this.permissionService.getAll();
        return { items };
    }
}
