import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ROUTER, STATISTIC_ADMIN_ROUTE } from '../../../common/constant/router.constant';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
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
