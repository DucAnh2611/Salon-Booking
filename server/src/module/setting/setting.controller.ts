import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ROUTER, SETTING_ROUTE } from '../../constant/router.constant';
import { TargetActionRequire } from '../../decorator/permission.decorator';
import { UserType } from '../../decorator/user-types.decorator';
import { UserTypeEnum } from '../../enum/user.enum';
import { AccessTokenGuard } from '../../guard/accessToken.guard';
import { PermissionGuard } from '../../guard/permission.guard';
import { UserTypeGuard } from '../../guard/user-type.guard';
import { AppRequest } from '../../interface/custom-request.interface';
import { SettingUpdateDto } from './dto/setting-update.dto';
import { SettingService } from './setting.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.SETTING)
export class SettingController {
    constructor(private readonly settingService: SettingService) {}

    @Post(SETTING_ROUTE.RESET)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([])
    reset(@Req() req: AppRequest) {
        const { employeeId } = req.accessPayload;
        return this.settingService.reset(employeeId);
    }

    @Get(SETTING_ROUTE.GET)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([])
    get() {
        return this.settingService.get();
    }

    @Put(SETTING_ROUTE.UPDATE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([])
    update(@Req() req: AppRequest, @Body() body: SettingUpdateDto) {
        const { employeeId } = req.accessPayload;
        return this.settingService.update(employeeId, body);
    }
}
