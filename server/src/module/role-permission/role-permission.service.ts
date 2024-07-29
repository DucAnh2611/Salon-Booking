import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { CreateRolePermisisonDto } from './dto/attach.dto';
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
        const querybuilder = await this.rolePermissionRepository.find({
            where: { roleId },
            loadEagerRelations: false,
            relations: {
                permission: true,
            },
        });

        return querybuilder;
    }

    async attach({ roleId, permissionIds, userId }: CreateRolePermisisonDto) {
        const isExist = await this.getRolePermissionsByRoleId(roleId);
        const deleteList = [];
        const addList = [];

        isExist.forEach((permission: RolePermissionEntity) => {
            const perm = permissionIds.find((id: string) => id === permission.permissionId);

            if (!perm) {
                deleteList.push(permission.permissionId);
            }
        });

        permissionIds.forEach((id: string) => {
            const rolePermission = isExist.find(item => item.permissionId === id);

            if (!rolePermission) {
                addList.push({ permissionId: id, roleId, createdBy: userId });
            }
        });

        await Promise.all([
            isExist.length > 0
                ? this.rolePermissionRepository.delete({
                      permissionId: In(deleteList),
                      roleId,
                  })
                : true,
            this.rolePermissionRepository.save(addList),
        ]);

        return DataSuccessCodeEnum.OK;
    }

    groupPermission(list: RolePermissionEntity[]) {}
}
