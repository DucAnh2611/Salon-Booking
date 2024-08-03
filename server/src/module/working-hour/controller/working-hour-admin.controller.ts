import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../../common/constant/role.constant';
import { ROUTER, WORKING_HOUR_ROUTE } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { CreateWorkingHourDto } from '../dto/working-hour-create.dto';
import { DeleteWorkingHourDto } from '../dto/working-hour-delete.dto';
import { GetWorkingHourParamDto, GetWorkingHourRangeDto, OffWorkingQueryDto } from '../dto/working-hour-get.dto';
import { UpdateWorkingHourDto } from '../dto/working-hour-update.dto';
import { WorkingHourService } from '../working-hour.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.WORKING_HOUR)
export class WorkingHourAdminController {
    constructor(private readonly workingHourService: WorkingHourService) {}

    @Get(WORKING_HOUR_ROUTE.FIND)
    @UserType(ROLE_TITLE.staff)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.WORKING_HOUR,
            action: [PermissionActionEnum.READ],
        },
    ])
    getRange(@Req() req: AppRequest, @Query() query: GetWorkingHourRangeDto) {
        return this.workingHourService.getRange(query);
    }

    @Get(WORKING_HOUR_ROUTE.DETAIL)
    @UserType(ROLE_TITLE.staff)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.WORKING_HOUR,
            action: [PermissionActionEnum.READ],
        },
    ])
    detail(@Req() req: AppRequest, @Param() param: GetWorkingHourParamDto) {
        const { id } = param;

        return this.workingHourService.detail(id);
    }

    @Post(WORKING_HOUR_ROUTE.CREATE)
    @UserType(ROLE_TITLE.staff)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.WORKING_HOUR,
            action: [PermissionActionEnum.CREATE],
        },
    ])
    create(@Req() req: AppRequest, @Body() body: CreateWorkingHourDto) {
        const { accessPayload } = req;
        const { employeeId } = accessPayload;

        return this.workingHourService.saveDateRange(employeeId, body);
    }

    @Get(WORKING_HOUR_ROUTE.TOGGLE_OFF)
    @UserType(ROLE_TITLE.staff)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.WORKING_HOUR,
            action: [PermissionActionEnum.UPDATE],
        },
    ])
    toggleOff(@Req() req: AppRequest, @Query() query: OffWorkingQueryDto) {
        const { accessPayload } = req;
        const { employeeId } = accessPayload;

        return this.workingHourService.toggleOffDay(employeeId, query);
    }

    @Put(WORKING_HOUR_ROUTE.UPDATE)
    @UserType(ROLE_TITLE.staff)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.WORKING_HOUR,
            action: [PermissionActionEnum.UPDATE],
        },
    ])
    update(@Req() req: AppRequest, @Body() body: UpdateWorkingHourDto) {
        const { accessPayload } = req;
        const { employeeId } = accessPayload;

        return this.workingHourService.update(employeeId, body);
    }

    @Delete(WORKING_HOUR_ROUTE.DELETE_ONE)
    @UserType(ROLE_TITLE.staff)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.WORKING_HOUR,
            action: [PermissionActionEnum.DELETE],
        },
    ])
    deleteOne(@Req() req: AppRequest, @Param() param: GetWorkingHourParamDto) {
        const { id } = param;

        return this.workingHourService.deleteOne(id);
    }

    @Delete(WORKING_HOUR_ROUTE.DELETE_MANY)
    @UserType(ROLE_TITLE.staff)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.WORKING_HOUR,
            action: [PermissionActionEnum.DELETE],
        },
    ])
    deleteMany(@Req() req: AppRequest, @Body() body: DeleteWorkingHourDto) {
        const { accessPayload } = req;
        const { employeeId } = accessPayload;

        return this.workingHourService.deleteMany(employeeId, body);
    }
}
