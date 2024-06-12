import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ROLE_PERMISSION_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../common/enum/permission.enum';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../shared/decorator/permission.decorator';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { AttachPermissionDto } from './dto/attach.dto';
import { GetOneRolePermissionDto } from './dto/get.dto';
import { RolePermissionService } from './role-permission.service';

@UseGuards(AccessTokenGuard, PermissionGuard)
@Controller(ROUTER.ROLE_PERMISSION)
export class RolePermissionController {
    constructor(private readonly rolePermissionService: RolePermissionService) {}

    @Get(ROLE_PERMISSION_ROUTE.INFO)
    @TargetActionRequire([{ target: PermissionTargetEnum.ROLE_PERMISSION, action: [PermissionActionEnum.READ] }])
    async detail(@Param() param: GetOneRolePermissionDto) {
        const { roleId } = param;
        const list = await this.rolePermissionService.getRolePermissionsByRoleId(roleId);

        return this.rolePermissionService.groupPermission(list);
    }

    @Post(ROLE_PERMISSION_ROUTE.ADD)
    @TargetActionRequire([{ target: PermissionTargetEnum.ROLE_PERMISSION, action: [PermissionActionEnum.CREATE] }])
    attach(@Body() rolePermisison: AttachPermissionDto, @Request() req: AppRequest) {
        const { accessPayload } = req;
        const { permissionIds, roleId } = rolePermisison;

        return this.rolePermissionService.attach({
            userId: accessPayload.employeeId,
            roleId,
            permissions: permissionIds,
        });
    }

    @Put(ROLE_PERMISSION_ROUTE.UPDATE)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.ROLE_PERMISSION,
            action: [PermissionActionEnum.UPDATE, PermissionActionEnum.DELETE, PermissionActionEnum.CREATE],
        },
    ])
    update(@Body() rolePermisison: AttachPermissionDto, @Request() req: AppRequest) {
        const { accessPayload } = req;
        const { permissionIds, roleId } = rolePermisison;

        return this.rolePermissionService.attach({
            userId: accessPayload.employeeId,
            roleId,
            permissions: permissionIds,
        });
    }
}
