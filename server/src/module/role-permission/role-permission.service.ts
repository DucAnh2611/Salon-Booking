import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { TargetActionType } from '../../shared/decorator/permission.decorator';
import { BadRequest, InternalServer } from '../../shared/exception/error.exception';
import { GetPermissionTargetDto } from './dto/get.dto';
import { RolePermissionEntity } from './entity/role-permission.entity';

@Injectable()
export class RolePermissionService {
    constructor(
        @InjectRepository(RolePermissionEntity)
        private readonly rolePermissionRepository: Repository<RolePermissionEntity>,
    ) {}

    async getPermisisonTarget(query: GetPermissionTargetDto) {
        const { roleId, target } = query;

        const data = await this.rolePermissionRepository
            .createQueryBuilder('role_permission')
            .innerJoinAndSelect('role_permission.permission', 'permission')
            .select(['role_permission.roleId', 'permission.target', 'permission.action'])
            .where('role_permission.roleId = :roleId AND permission.target = :target', { roleId, target })
            .getMany();

        if (!data.length) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ROLE_PERMISSION });
        }

        return data;
    }

    async getRolePermissionsByRoleId(roleId: string) {
        const querybuilder = await this.rolePermissionRepository
            .createQueryBuilder('role_permission')
            .leftJoinAndSelect('role_permission.permission', 'permission')
            .select(['role_permission.roleId', 'permission', 'permission.id', 'permission.target', 'permission.action'])
            .where('role_permission.roleId = :roleId', { roleId })
            .getMany();

        if (!querybuilder.length) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ROLE_PERMISSION });
        }

        return querybuilder;
    }

    async attach({ roleId, permissions, userId }: { roleId: string; permissions: string[]; userId: string }) {
        let isExist = await this.getRolePermissionsByRoleId(roleId);

        const newListRolePermission = permissions.reduce((acc: RolePermissionEntity[], permission: string) => {
            const index = isExist.findIndex((p: RolePermissionEntity) => p.permissionId === permission);

            if (index !== -1) {
                isExist = isExist.filter((_, id: number) => id !== index);
            } else {
                acc.push(
                    this.rolePermissionRepository.create({
                        permissionId: permission,
                        roleId: roleId,
                        createdBy: userId,
                    }),
                );
            }
            return acc;
        }, []);

        const [deletePer, updatePer] = await Promise.all([
            isExist.length > 0
                ? this.rolePermissionRepository
                      .createQueryBuilder('rolePermission')
                      .delete()
                      .where('"role_permission"."permissionId" IN (:...permissions)', {
                          permissions: isExist.map(item => item.permissionId),
                      })
                      .execute()
                : true,
            this.rolePermissionRepository.save(newListRolePermission),
        ]);

        if (!deletePer || !updatePer) {
            throw new InternalServer();
        }

        return DataSuccessCodeEnum.OK;
    }

    groupPermission(list: RolePermissionEntity[]) {
        return list.reduce((acc: TargetActionType[], curr: RolePermissionEntity) => {
            const index = acc.findIndex(item => item.target === curr.permission.target);
            if (index !== -1) {
                acc[index].action.push(curr.permission.action);
            } else {
                acc.push({ target: curr.permission.target, action: [curr.permission.action] });
            }
            return acc;
        }, []);
    }
}
