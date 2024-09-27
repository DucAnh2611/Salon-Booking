import { Controller, Get, UseGuards } from '@nestjs/common';
import { PERMISSION_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../common/enum/permission.enum';
import { UserTypeEnum } from '../../common/enum/user.enum';
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
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.PERMISSION, action: [PermissionActionEnum.READ] }])
    async getAll() {
        const items = await this.permissionService.getAll();
        return { items };
    }
}
