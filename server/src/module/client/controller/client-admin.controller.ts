import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { CLIENT_ADMIN_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { SearchClientDto } from '../dto/client-get.dto';
import { ClientUpdateLockDto } from '../dto/client-update.dto';
import { ClientAdminService } from '../service/client-admin.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.CLIENT_ADMIN)
export class ClientAdminController {
    constructor(private readonly clientAdminService: ClientAdminService) {}

    @Post(CLIENT_ADMIN_ROUTE.LIST)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.CLIENT, action: [PermissionActionEnum.READ] }])
    list(@Body() body: SearchClientDto) {
        return this.clientAdminService.list(body);
    }

    @Put(CLIENT_ADMIN_ROUTE.UPDATE_LOCK)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.CLIENT, action: [PermissionActionEnum.UPDATE] }])
    updateLock(@Body() body: ClientUpdateLockDto) {
        return this.clientAdminService.updateLock(body);
    }
}
