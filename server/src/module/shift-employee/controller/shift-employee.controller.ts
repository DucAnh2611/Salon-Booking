import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ROUTER, SHIFT_EMPLOYEE_CLIENT_ROUTE } from '../../../constant/router.constant';
import { UserType } from '../../../decorator/user-types.decorator';
import { UserTypeEnum } from '../../../enum/user.enum';
import { AccessTokenClientGuard } from '../../../guard/accessToken.guard';
import { UserTypeGuard } from '../../../guard/user-type.guard';
import { OrderServiceCheckOverlapDto } from '../dto/order-service-item-get.dto';
import { GetServiceShiftEmployeeDto } from '../dto/shift-employee-get.dto';
import { ShiftEmployeeService } from '../shift-employee.service';

@UseGuards(AccessTokenClientGuard, UserTypeGuard)
@Controller(ROUTER.SHIFT_EMPLOYEE_CLIENT)
export class ShiftEmployeeClientController {
    constructor(private readonly shiftEmployeeService: ShiftEmployeeService) {}

    @Post(SHIFT_EMPLOYEE_CLIENT_ROUTE.SERVICE_EMPLOYEE)
    @UserType(UserTypeEnum.CLIENT)
    getServiceEmployeeForShift(@Body() body: GetServiceShiftEmployeeDto) {
        return this.shiftEmployeeService.getServiceEmployeeBookingTime(body);
    }

    @Post(SHIFT_EMPLOYEE_CLIENT_ROUTE.CHECK_OVERLAP_SERVICE)
    @UserType(UserTypeEnum.CLIENT)
    checkOverlap(@Body() body: OrderServiceCheckOverlapDto) {
        return this.shiftEmployeeService.checkOverlapServiceEmployee(body);
    }
}
