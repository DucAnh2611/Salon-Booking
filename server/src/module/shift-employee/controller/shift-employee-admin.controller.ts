import { Body, Controller, Delete, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ROUTER, SHIFT_EMPLOYEE_ROUTE } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { BodyCreateShiftEmployeeDto } from '../dto/shift-employee-create.dto';
import { DeleteOneShiftEmployeeDto, DeleteShiftEmployeeDto } from '../dto/shift-employee-delete.dto';
import { UpdateShiftEmployeeDto } from '../dto/shift-employee-update.dto';
import { ShiftEmployeeService } from '../shift-employee.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.SHIFT_EMPLOYEE)
export class ShiftEmployeeAdminController {
    constructor(private readonly shiftEmployeeService: ShiftEmployeeService) {}

    @Post(SHIFT_EMPLOYEE_ROUTE.CREATE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.SHIFT_EMPLOYEE, action: [PermissionActionEnum.CREATE] }])
    create(@Req() req: AppRequest, @Body() body: BodyCreateShiftEmployeeDto) {
        const { employeeId } = req.accessPayload;

        return this.shiftEmployeeService.saveMany(employeeId, body);
    }

    @Put(SHIFT_EMPLOYEE_ROUTE.UPDATE_STATUS)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.SHIFT_EMPLOYEE, action: [PermissionActionEnum.UPDATE] }])
    updateStatus(@Req() req: AppRequest, @Body() body: UpdateShiftEmployeeDto) {
        const { employeeId } = req.accessPayload;

        return this.shiftEmployeeService.updateStatus(employeeId, body);
    }

    @Delete(SHIFT_EMPLOYEE_ROUTE.DELETE_ONE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.SHIFT_EMPLOYEE, action: [PermissionActionEnum.DELETE] }])
    deleteOne(@Req() req: AppRequest, @Body() { employeeId, shiftId }: DeleteOneShiftEmployeeDto) {
        return this.shiftEmployeeService.deleteOne(shiftId, employeeId);
    }

    @Delete(SHIFT_EMPLOYEE_ROUTE.DELETE_MANY)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.SHIFT_EMPLOYEE, action: [PermissionActionEnum.DELETE] }])
    deleteMany(@Req() req: AppRequest, @Body() body: DeleteShiftEmployeeDto) {
        return this.shiftEmployeeService.deleteMany(body);
    }
}
