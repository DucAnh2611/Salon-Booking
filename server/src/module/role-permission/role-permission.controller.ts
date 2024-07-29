import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../common/constant/role.constant';
import { ROLE_PERMISSION_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../common/enum/permission.enum';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../shared/decorator/permission.decorator';
import { UserType } from '../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { AttachPermissionDto } from './dto/attach.dto';
import { GetOneRolePermissionDto } from './dto/get.dto';
import { RolePermissionService } from './role-permission.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.ROLE_PERMISSION)
export class RolePermissionController {
    constructor(private readonly rolePermissionService: RolePermissionService) {}

    @Get(ROLE_PERMISSION_ROUTE.INFO)
    @TargetActionRequire([{ target: PermissionTargetEnum.ROLE_PERMISSION, action: [PermissionActionEnum.READ] }])
    @UserType(ROLE_TITLE.staff)
    async detail(@Param() param: GetOneRolePermissionDto) {
        const { roleId } = param;
        const list = await this.rolePermissionService.getRolePermissionsByRoleId(roleId);

        return this.rolePermissionService.groupPermission(list);
    }

    @Post(ROLE_PERMISSION_ROUTE.ADD)
    @TargetActionRequire([{ target: PermissionTargetEnum.ROLE_PERMISSION, action: [PermissionActionEnum.CREATE] }])
    @UserType(ROLE_TITLE.staff)
    attach(@Body() rolePermisison: AttachPermissionDto, @Req() req: AppRequest) {
        const { accessPayload } = req;
        const { permissionIds, roleId } = rolePermisison;

        return this.rolePermissionService.attach({
            userId: accessPayload.employeeId,
            roleId,
            permissionIds: permissionIds,
        });
    }

    @Put(ROLE_PERMISSION_ROUTE.UPDATE)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.ROLE_PERMISSION,
            action: [PermissionActionEnum.UPDATE, PermissionActionEnum.DELETE, PermissionActionEnum.CREATE],
        },
    ])
    @UserType(ROLE_TITLE.staff)
    update(@Body() rolePermisison: AttachPermissionDto, @Req() req: AppRequest) {
        const { accessPayload } = req;
        const { permissionIds, roleId } = rolePermisison;

        return this.rolePermissionService.attach({
            userId: accessPayload.employeeId,
            roleId,
            permissionIds: permissionIds,
        });
    }
}
