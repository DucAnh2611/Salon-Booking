import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../../common/constant/role.constant';
import { ROUTER, SERVICE_ROUTE } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { CreateServiceDto } from '../dto/service-create.dto';
import { UpdateServiceDto } from '../dto/service-update.dto';
import { ServiceService } from '../service.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@UserType(ROLE_TITLE.staff)
@Controller(ROUTER.SERVICE)
export class ServiceAdminController {
    constructor(private readonly serviceService: ServiceService) {}

    @Post(SERVICE_ROUTE.CREATE)
    @TargetActionRequire([{ target: PermissionTargetEnum.SERVICE, action: [PermissionActionEnum.CREATE] }])
    create(@Req() req: AppRequest, @Body() body: CreateServiceDto) {
        const { accessPayload } = req;
        const { userId, employeeId } = accessPayload;

        return this.serviceService.create(userId, employeeId, body);
    }

    @Put(SERVICE_ROUTE.UPDATE)
    @TargetActionRequire([{ target: PermissionTargetEnum.SERVICE, action: [PermissionActionEnum.UPDATE] }])
    update(@Req() req: AppRequest, @Body() body: UpdateServiceDto) {
        const { accessPayload } = req;
        const { userId, employeeId } = accessPayload;

        return this.serviceService.update(userId, employeeId, body);
    }
}
