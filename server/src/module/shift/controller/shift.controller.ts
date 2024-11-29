import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ROUTER, SHIFT_ROUTE } from '../../../constant/router.constant';
import { UserType } from '../../../decorator/user-types.decorator';
import { UserTypeEnum } from '../../../enum/user.enum';
import { AccessTokenClientGuard } from '../../../guard/accessToken.guard';
import { UserTypeGuard } from '../../../guard/user-type.guard';
import { GetShiftFromBookingTimeDto } from '../dto/shift-get.dto';
import { ShiftService } from '../shift.service';

@UseGuards(AccessTokenClientGuard, UserTypeGuard)
@Controller(ROUTER.SHIFT)
export class ShiftClientController {
    constructor(private readonly shiftService: ShiftService) {}

    @Post(SHIFT_ROUTE.BOOKING)
    @UserType(UserTypeEnum.CLIENT)
    getShiftForBookignDate(@Body() body: GetShiftFromBookingTimeDto) {
        return this.shiftService.getShiftFromBookingDate(body);
    }
}
