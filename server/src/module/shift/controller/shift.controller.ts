import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ROUTER, SHIFT_ROUTE } from '../../../common/constant/router.constant';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenClientGuard } from '../../../shared/guard/accessToken.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
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
