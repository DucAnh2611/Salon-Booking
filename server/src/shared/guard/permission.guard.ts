import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { RolePermissionService } from '../../module/role-permission/role-permission.service';
import { RoleEntity } from '../../module/role/entity/role.entity';
import { RoleService } from '../../module/role/role.service';
import { TargetActionRequire, TargetActionType } from '../decorator/permission.decorator';
import { BadRequest, Forbidden } from '../exception/error.exception';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly rolePermissionService: RolePermissionService,
        private readonly roleService: RoleService,
    ) {}

    async canActivate(context: ExecutionContext) {
        const targetActionRequires = this.reflector.get(TargetActionRequire, context.getHandler());
        if (!targetActionRequires || !targetActionRequires.length) {
            return true;
        }

        const request: AppRequest = context.switchToHttp().getRequest();

        const { accessPayload } = request;

        let tempRole: RoleEntity = null;

        if (accessPayload.eRoleId) {
            tempRole = await this.roleService.getById(accessPayload.eRoleId);
        }

        if (!tempRole) {
            throw new BadRequest({
                message: accessPayload.eRoleId
                    ? DataErrorCodeEnum.INVALID_STAFF_ROLE
                    : DataErrorCodeEnum.INVALID_CLIENT_ROLE,
            });
        }

        const { isValid, userTargetAction } = await this.checkActionForTarget({
            roleId: tempRole.id,
            targetActionRequires,
        });

        if (!isValid) {
            throw new Forbidden({
                message: {
                    require: targetActionRequires,
                    userPermission: userTargetAction,
                },
            });
        }
        return isValid;
    }

    async checkActionForTarget({
        roleId,
        targetActionRequires,
    }: {
        roleId: string;
        targetActionRequires: TargetActionType[];
    }) {
        const listPermission = await Promise.all(
            targetActionRequires.map(async action =>
                this.rolePermissionService.getPermisisonTarget({
                    roleId,
                    target: action.target,
                }),
            ),
        );

        const temp: TargetActionType[] = [];

        listPermission.forEach(permission => {
            permission.forEach(per => {
                const index = temp.findIndex(e => e.target === per.permission.target);
                const { action, target } = per.permission;
                if (index !== -1) {
                    temp[index].action.push(action);
                } else {
                    temp.push({ target, action: [action] });
                }
            });
        });

        for (const requirement of targetActionRequires) {
            const targetTemp = temp.find(item => item.target === requirement.target);
            if (!targetTemp) {
                return { isValid: false, userTargetAction: temp };
            } else {
                for (const action of requirement.action) {
                    if (targetTemp.action.findIndex(a => a === action) === -1) {
                        return { isValid: false, userTargetAction: temp };
                    }
                }
            }
        }

        return { isValid: true, userTargetAction: temp };
    }
}
