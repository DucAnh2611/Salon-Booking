import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ROUTER, SETTING_ROUTE } from '../../common/constant/router.constant';
import { UserTypeEnum } from '../../common/enum/user.enum';
import { TargetActionRequire } from '../../shared/decorator/permission.decorator';
import { UserType } from '../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { SettingUpdateDto } from './dto/setting-update.dto';
import { SettingService } from './setting.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.SETTING)
export class SettingController {
    constructor(private readonly settingService: SettingService) {}

    @Post(SETTING_ROUTE.RESET)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([])
    reset() {
        return this.settingService.reset();
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
    update(@Body() body: SettingUpdateDto) {
        return this.settingService.update(body);
    }
}
