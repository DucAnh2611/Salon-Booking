import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ROUTER } from '../../../common/constant/router.constant';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { GetShiftFromBookingTimeDto } from '../dto/shift-get.dto';
import { ShiftService } from '../shift.service';

@UseGuards(AccessTokenGuard, UserTypeGuard)
@Controller(ROUTER.SHIFT)
export class ShiftClientController {
    constructor(private readonly shiftService: ShiftService) {}

    @Post('booking')
    getShiftForBookignDate(@Body() body: GetShiftFromBookingTimeDto) {
        return this.shiftService.getShiftFromBookingDate(body);
    }
}
