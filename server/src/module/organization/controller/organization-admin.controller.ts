import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ORGANIZATION_ADMIN_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { OrganizationCreateDto } from '../dto/organization-create.dto';
import { OrganizationGetParamDto, OrganizationListDto } from '../dto/organization-get.dto';
import { OrganizationShowDto, OrganizationUpdateDto } from '../dto/organization-update.dto';
import { OrganizationAdminService } from '../service/organization-admin.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.ORGANIZATION_ADMIN)
export class OrganizationAdminController {
    constructor(private readonly organizationAdminServicer: OrganizationAdminService) {}

    @Get(ORGANIZATION_ADMIN_ROUTE.CURRENT)
    @TargetActionRequire([])
    current() {
        return this.organizationAdminServicer.current();
    }

    @Get(ORGANIZATION_ADMIN_ROUTE.DETAIL)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORGANIZATION, action: [PermissionActionEnum.READ] }])
    detail(@Param() param: OrganizationGetParamDto) {
        const { id } = param;

        return this.organizationAdminServicer.detail(id);
    }

    @Post(ORGANIZATION_ADMIN_ROUTE.LIST)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORGANIZATION, action: [PermissionActionEnum.READ] }])
    list(@Body() body: OrganizationListDto) {
        return this.organizationAdminServicer.list(body);
    }

    @Post(ORGANIZATION_ADMIN_ROUTE.CREATE)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORGANIZATION, action: [PermissionActionEnum.CREATE] }])
    create(@Req() req: AppRequest, @Body() body: OrganizationCreateDto) {
        const { employeeId, userId } = req.accessPayload;

        return this.organizationAdminServicer.create(userId, employeeId, body);
    }

    @Put(ORGANIZATION_ADMIN_ROUTE.UPDATE)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORGANIZATION, action: [PermissionActionEnum.UPDATE] }])
    update(@Req() req: AppRequest, @Body() body: OrganizationUpdateDto) {
        const { employeeId, userId } = req.accessPayload;

        return this.organizationAdminServicer.update(userId, employeeId, body);
    }

    @Delete(ORGANIZATION_ADMIN_ROUTE.DELETE)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORGANIZATION, action: [PermissionActionEnum.DELETE] }])
    remove(@Req() req: AppRequest, @Param() param: OrganizationGetParamDto) {
        const { id } = param;

        return this.organizationAdminServicer.remove(id);
    }

    @Put(ORGANIZATION_ADMIN_ROUTE.SELECT_SHOW)
    @TargetActionRequire([{ target: PermissionTargetEnum.ORGANIZATION, action: [PermissionActionEnum.UPDATE] }])
    selectShow(@Req() req: AppRequest, @Body() body: OrganizationShowDto) {
        const { employeeId } = req.accessPayload;

        return this.organizationAdminServicer.selectShow(employeeId, body);
    }
}
