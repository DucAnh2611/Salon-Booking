import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ROUTER } from '../../../common/constant/router.constant';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { GetServiceShiftEmployeeDto } from '../dto/shift-employee-get.dto';
import { ShiftEmployeeService } from '../shift-employee.service';

@UseGuards(AccessTokenGuard, UserTypeGuard)
@Controller(ROUTER.SHIFT_EMPLOYEE)
export class ShiftEmployeeClientController {
    constructor(private readonly shiftEmployeeService: ShiftEmployeeService) {}

    @Post('service-employee')
    getServiceEmployeeForShift(@Body() body: GetServiceShiftEmployeeDto) {
        return this.shiftEmployeeService.getServiceEmployeeBookingTime(body);
    }
}
