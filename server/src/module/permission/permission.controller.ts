import { Controller, Get, UseGuards } from '@nestjs/common';
import { PERMISSION_ROUTE, ROUTER } from '../../constant/router.constant';
import { TargetActionRequire } from '../../decorator/permission.decorator';
import { UserType } from '../../decorator/user-types.decorator';
import { PermissionActionEnum, PermissionTargetEnum } from '../../enum/permission.enum';
import { UserTypeEnum } from '../../enum/user.enum';
import { AccessTokenGuard } from '../../guard/accessToken.guard';
import { PermissionGuard } from '../../guard/permission.guard';
import { UserTypeGuard } from '../../guard/user-type.guard';
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
