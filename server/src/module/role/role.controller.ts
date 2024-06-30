import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../common/constant/role.constant';
import { ROLE_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../common/enum/permission.enum';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../shared/decorator/permission.decorator';
import { UserType } from '../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { AddNewRoleDto } from './dto/create-role.dto';
import { DeleteManyRoleDtop } from './dto/delete-role.dto';
import { FindRoleDto, GetOneRoleDto } from './dto/get-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.ROLE)
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get(ROLE_ROUTE.ROLE_FIND)
    @TargetActionRequire([
        {
            action: [PermissionActionEnum.READ],
            target: PermissionTargetEnum.ROLE,
        },
    ])
    @UserType(ROLE_TITLE.staff)
    async get(@Query() query: FindRoleDto) {
        const data = await this.roleService.find(query);
        return data;
    }

    @Get(ROLE_ROUTE.ROLE_INFO)
    @TargetActionRequire([{ action: [PermissionActionEnum.READ], target: PermissionTargetEnum.ROLE }])
    @UserType(ROLE_TITLE.staff)
    async info(@Param() param: GetOneRoleDto) {
        const { id } = param;
        return this.roleService.getById(id);
    }

    @Post(ROLE_ROUTE.ROLE_ADD)
    @TargetActionRequire([
        {
            action: [PermissionActionEnum.CREATE],
            target: PermissionTargetEnum.ROLE,
        },
    ])
    @UserType(ROLE_TITLE.staff)
    add(@Request() req: AppRequest, @Body() newRole: AddNewRoleDto) {
        const { accessPayload } = req;
        return this.roleService.create(newRole, accessPayload.employeeId);
    }

    @Put(ROLE_ROUTE.ROLE_UPDATE)
    @TargetActionRequire([
        {
            action: [PermissionActionEnum.UPDATE],
            target: PermissionTargetEnum.ROLE,
        },
    ])
    @UserType(ROLE_TITLE.staff)
    update(@Request() req: AppRequest, @Param() param: GetOneRoleDto, @Body() newRole: UpdateRoleDto) {
        const { accessPayload } = req;
        return this.roleService.update(param.id, newRole, accessPayload.employeeId);
    }

    @Delete(ROLE_ROUTE.ROLE_DELETE_ONE)
    @TargetActionRequire([
        {
            action: [PermissionActionEnum.DELETE],
            target: PermissionTargetEnum.ROLE,
        },
    ])
    @UserType(ROLE_TITLE.staff)
    deleteOne(@Param() param: GetOneRoleDto) {
        return this.roleService.softDelete([param.id]);
    }

    @Delete(ROLE_ROUTE.ROLE_DELETE_MANY)
    @TargetActionRequire([
        {
            action: [PermissionActionEnum.DELETE],
            target: PermissionTargetEnum.ROLE,
        },
    ])
    @UserType(ROLE_TITLE.staff)
    deleteMany(@Body() body: DeleteManyRoleDtop) {
        const { roleIds } = body;
        return this.roleService.softDelete(roleIds);
    }
}
