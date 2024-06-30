import { Controller, Get, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../common/constant/role.constant';
import { PERMISSION_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../common/enum/permission.enum';
import { TargetActionRequire } from '../../shared/decorator/permission.decorator';
import { UserType } from '../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { PermissionService } from './permission.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.PERMISSION)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Get(PERMISSION_ROUTE.ALL)
    @TargetActionRequire([{ target: PermissionTargetEnum.PERMISSION, action: [PermissionActionEnum.READ] }])
    @UserType(ROLE_TITLE.staff)
    async getAll() {
        const items = await this.permissionService.getAll();
        return { items };
    }
}
