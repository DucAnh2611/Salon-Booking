import { Body, Controller, Delete, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ORGANIZATION_ADMIN_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { OrganizationCreateDto } from '../dto/organization-create.dto';
import { OrganizationGetParamDto, OrganizationListDto } from '../dto/organization-get.dto';
import { OrganizationUpdateDto } from '../dto/organization-update.dto';
import { OrganizationAdminService } from '../service/organization-admin.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.ORGANIZATION_ADMIN)
export class OrganizationAdminController {
    constructor(private readonly organizationAdminServicer: OrganizationAdminService) {}

    @Post(ORGANIZATION_ADMIN_ROUTE.LIST)
    list(@Body() body: OrganizationListDto) {
        return this.organizationAdminServicer.list(body);
    }

    @Post(ORGANIZATION_ADMIN_ROUTE.CREATE)
    create(@Req() req: AppRequest, @Body() body: OrganizationCreateDto) {
        const { employeeId } = req.accessPayload;

        return this.organizationAdminServicer.create(employeeId, body);
    }

    @Put(ORGANIZATION_ADMIN_ROUTE.UPDATE)
    update(@Req() req: AppRequest, @Body() body: OrganizationUpdateDto) {
        const { employeeId } = req.accessPayload;

        return this.organizationAdminServicer.update(employeeId, body);
    }

    @Delete(ORGANIZATION_ADMIN_ROUTE.DELETE)
    remove(@Req() req: AppRequest, @Param() param: OrganizationGetParamDto) {
        const { id } = param;

        return this.organizationAdminServicer.remove(id);
    }

    @Put(ORGANIZATION_ADMIN_ROUTE.TOGGLE)
    toggle(@Req() req: AppRequest, @Param() param: OrganizationGetParamDto) {
        const { employeeId } = req.accessPayload;
        const { id } = param;

        return this.organizationAdminServicer.toggle(id);
    }
}
