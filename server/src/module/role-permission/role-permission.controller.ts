import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ROLE_PERMISSION_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { AttachPermissionDto } from './dto/attach.dto';
import { GetOneRolePermissionDto } from './dto/get.dto';
import { RolePermissionService } from './role-permission.service';

@Controller(ROUTER.ROLE_PERMISSION)
export class RolePermissionController {
    constructor(private readonly rolePermissionService: RolePermissionService) {}

    @Get(ROLE_PERMISSION_ROUTE.INFO)
    async detail(@Param() param: GetOneRolePermissionDto) {
        const { roleId } = param;
        const list = await this.rolePermissionService.getRolePermissionsByRoleId(roleId);

        return this.rolePermissionService.groupPermission(list);
    }

    @Post(ROLE_PERMISSION_ROUTE.ADD)
    attach(@Body() rolePermisison: AttachPermissionDto, @Request() req: AppRequest) {
        const { accessPayload } = req;
        const { permissionIds, roleId } = rolePermisison;

        return this.rolePermissionService.attach({
            userId: accessPayload.employeeId,
            roleId,
            permissions: permissionIds,
        });
    }
}
