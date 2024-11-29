import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ROUTER, STATISTIC_ADMIN_ROUTE } from '../../../constant/router.constant';
import { TargetActionRequire } from '../../../decorator/permission.decorator';
import { UserType } from '../../../decorator/user-types.decorator';
import { UserTypeEnum } from '../../../enum/user.enum';
import { AccessTokenGuard } from '../../../guard/accessToken.guard';
import { PermissionGuard } from '../../../guard/permission.guard';
import { UserTypeGuard } from '../../../guard/user-type.guard';
import { AppRequest } from '../../../interface/custom-request.interface';
import { StatisticDashboardDto } from '../dto/statistic-dashboard.dto';
import { StatisticAdminService } from '../service/statistic-admin.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.STATISTIC_ADMIN)
export class StatisticAdminController {
    constructor(private readonly statisticAdminServicer: StatisticAdminService) {}

    @Post(STATISTIC_ADMIN_ROUTE.DASHBOARD)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([])
    dashboard(@Req() req: AppRequest, @Body() body: StatisticDashboardDto) {
        const { employeeId } = req.accessPayload;

        return this.statisticAdminServicer.dashboard(employeeId, body);
    }
}
