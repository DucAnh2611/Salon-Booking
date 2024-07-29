import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../../common/constant/role.constant';
import { ROUTER, SERVICE_ROUTE } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { GetProductBaseParamDto } from '../../product-base/dto/product-base-get.dto';
import { CreateServiceDto } from '../dto/service-create.dto';
import { DeleteServiceDto } from '../dto/service-delete.dto';
import { FindServiceAdminDto, GetServiceParamDto } from '../dto/service-get.dto';
import { UpdateServiceDto } from '../dto/service-update.dto';
import { ServiceService } from '../service.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.SERVICE)
export class ServiceAdminController {
    constructor(private readonly serviceService: ServiceService) {}

    @Get(SERVICE_ROUTE.GET)
    @UserType(ROLE_TITLE.staff)
    @TargetActionRequire([{ target: PermissionTargetEnum.SERVICE, action: [PermissionActionEnum.READ] }])
    find(@Query() query: FindServiceAdminDto) {
        return this.serviceService.find(query);
    }

    @Get(SERVICE_ROUTE.DETAIL)
    @UserType(ROLE_TITLE.staff)
    @TargetActionRequire([{ target: PermissionTargetEnum.SERVICE, action: [PermissionActionEnum.READ] }])
    detail(@Param() param: GetProductBaseParamDto) {
        const { id } = param;
        return this.serviceService.detail(id);
    }

    @Post(SERVICE_ROUTE.CREATE)
    @UserType(ROLE_TITLE.staff)
    @TargetActionRequire([{ target: PermissionTargetEnum.SERVICE, action: [PermissionActionEnum.CREATE] }])
    create(@Req() req: AppRequest, @Body() body: CreateServiceDto) {
        const { accessPayload } = req;
        const { userId, employeeId } = accessPayload;

        return this.serviceService.create(userId, employeeId, body);
    }

    @Put(SERVICE_ROUTE.UPDATE)
    @UserType(ROLE_TITLE.staff)
    @TargetActionRequire([{ target: PermissionTargetEnum.SERVICE, action: [PermissionActionEnum.UPDATE] }])
    update(@Req() req: AppRequest, @Body() body: UpdateServiceDto) {
        const { accessPayload } = req;
        const { userId, employeeId } = accessPayload;

        return this.serviceService.update(userId, employeeId, body);
    }

    @Delete(SERVICE_ROUTE.DELETE_ONE)
    @UserType(ROLE_TITLE.staff)
    @TargetActionRequire([{ target: PermissionTargetEnum.SERVICE, action: [PermissionActionEnum.DELETE] }])
    deleteOne(@Req() req: AppRequest, @Param() param: GetServiceParamDto) {
        const { id } = param;
        return this.serviceService.delete([id]);
    }

    @Put(SERVICE_ROUTE.DELETE_MANY)
    @UserType(ROLE_TITLE.staff)
    @TargetActionRequire([{ target: PermissionTargetEnum.SERVICE, action: [PermissionActionEnum.DELETE] }])
    DeleteMany(@Req() req: AppRequest, @Body() body: DeleteServiceDto) {
        const { ids } = body;

        return this.serviceService.delete(ids);
    }
}
