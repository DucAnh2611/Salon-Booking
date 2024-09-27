import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ROUTER, SHIFT_ROUTE } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { CreateShiftDto } from '../dto/shift-create.dto';
import { GetShiftParamDto } from '../dto/shift-get.dto';
import { UpdateShiftDto } from '../dto/shift-update.dto';
import { ShiftService } from '../shift.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.SHIFT)
export class ShiftAdminController {
    constructor(private readonly shiftService: ShiftService) {}

    @Get(SHIFT_ROUTE.DETAIL)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.SHIFT, action: [PermissionActionEnum.READ] }])
    detail(@Req() req: AppRequest, @Param() param: GetShiftParamDto) {
        const { id } = param;

        return this.shiftService.detail(id);
    }

    @Post(SHIFT_ROUTE.CREATE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.SHIFT, action: [PermissionActionEnum.CREATE] }])
    create(@Req() req: AppRequest, @Body() body: CreateShiftDto) {
        const { employeeId } = req.accessPayload;

        return this.shiftService.save(employeeId, body);
    }

    @Put(SHIFT_ROUTE.UPDATE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.SHIFT, action: [PermissionActionEnum.UPDATE] }])
    update(@Req() req: AppRequest, @Body() body: UpdateShiftDto) {
        const { employeeId } = req.accessPayload;

        return this.shiftService.update(employeeId, body);
    }

    @Delete(SHIFT_ROUTE.DELETE_ONE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.SHIFT, action: [PermissionActionEnum.DELETE] }])
    deleteOne(@Req() req: AppRequest, @Param() param: GetShiftParamDto) {
        const { id: shiftId } = param;

        return this.shiftService.deleteOne(shiftId);
    }
}
