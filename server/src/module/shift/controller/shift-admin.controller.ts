import { Body, Controller, Delete, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../../common/constant/role.constant';
import { ROUTER, SHIFT_ROUTE } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
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
@UserType(ROLE_TITLE.staff)
@Controller(ROUTER.SHIFT)
export class ShiftAdminController {
    constructor(private readonly shiftService: ShiftService) {}

    @Post(SHIFT_ROUTE.CREATE)
    @TargetActionRequire([{ target: PermissionTargetEnum.SHIFT, action: [PermissionActionEnum.CREATE] }])
    create(@Req() req: AppRequest, @Body() body: CreateShiftDto) {
        const { employeeId } = req.accessPayload;

        return this.shiftService.save(employeeId, body);
    }

    @Put(SHIFT_ROUTE.UPDATE)
    @TargetActionRequire([{ target: PermissionTargetEnum.SHIFT, action: [PermissionActionEnum.UPDATE] }])
    update(@Req() req: AppRequest, @Body() body: UpdateShiftDto) {
        const { employeeId } = req.accessPayload;

        return this.shiftService.update(employeeId, body);
    }

    @Delete(SHIFT_ROUTE.DELETE_ONE)
    @TargetActionRequire([{ target: PermissionTargetEnum.SHIFT, action: [PermissionActionEnum.DELETE] }])
    deleteOne(@Req() req: AppRequest, @Param() param: GetShiftParamDto) {
        const { id: shiftId } = param;

        return this.shiftService.deleteOne(shiftId);
    }
}
