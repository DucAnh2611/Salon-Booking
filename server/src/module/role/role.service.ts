import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Like, Repository } from 'typeorm';
import { ROLE_TITLE } from '../../common/constant/role.constant';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { FindRoleDto } from './dto/get-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entity/role.entity';
import { TRoleGetRoleQuery } from './type/role.type';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>,
        private readonly rolePermissionService: RolePermissionService,
    ) {}

    async getAll() {
        return this.roleRepository.find();
    }

    isExist(id: string) {
        return this.roleRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    async getById(roleId: string) {
        const role = await this.roleRepository.findOne({ where: { id: roleId }, loadEagerRelations: false });
        if (!role) throw new BadRequest({ message: DataErrorCodeEnum.INVALID_ROLE });

        return role;
    }

    async detail(id: string) {
        const role = await this.roleRepository.findOne({
            where: { id },
            loadEagerRelations: false,
            relations: {
                parent: true,
                userCreate: {
                    userBase: {
                        userAvatar: true,
                    },
                    eRole: true,
                },
                userUpdate: {
                    userBase: {
                        userAvatar: true,
                    },
                    eRole: true,
                },
                rolePermission: {
                    permission: true,
                },
            },
        });
        if (!role) throw new BadRequest({ message: DataErrorCodeEnum.INVALID_ROLE });

        return role;
    }

    async getRoleId(query: TRoleGetRoleQuery) {
        const role = await this.getRole(query);
        return role.id;
    }

    getRole(query: TRoleGetRoleQuery) {
        return this.roleRepository.findOneBy(query);
    }

    async findAdmin(query: FindRoleDto) {
        const [items, count] = await this.roleRepository.findAndCount({
            where: { title: Like(`%${query.key}%`) },
            take: query.limit,
            skip: (query.page - 1) * query.limit,
            loadEagerRelations: false,
            relations: {
                parent: true,
            },
        });
        return { page: query.page, limit: query.limit, count, items };
    }

    async isNestedRole(id: string, parentId: string) {
        const parent = await this.roleRepository.findOne({
            where: { id: parentId },
            loadEagerRelations: false,
            relations: {
                parent: true,
            },
        });

        if (!parent) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PARENT_ROLE });
        }

        if (parent.parent && parent.parent.id !== id) {
            await this.isNestedRole(id, parent.parent.id);
        }

        if (parent.parent && parent.parent.id === id) {
            throw new BadRequest({ message: DataErrorCodeEnum.NESTED_ROLE });
        }

        return false;
    }

    async isValidParent(parentId: string) {
        const [staff, parent] = await Promise.all([
            this.roleRepository.findOne({
                where: { title: Equal(ROLE_TITLE.staff) },
                loadEagerRelations: false,
            }),
            this.roleRepository.findOne({ where: { id: parentId }, loadEagerRelations: false }),
        ]);
        if (!staff || !parent) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ROLE });
        }
        if (parent.level < staff.level) {
            throw new BadRequest({ message: DataErrorCodeEnum.PARENT_ROLE_CAN_NOT_HIGHER_THAN_STAFF });
        }
        return true;
    }

    async create(newRole: CreateRoleDto, userId: string) {
        const { parentId, permissionIds } = newRole;

        const parent = await this.isExist(parentId);
        if (!parent) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PARENT_ROLE });
        }

        await this.isValidParent(parent.id);

        const instanceRole = this.roleRepository.create({
            ...newRole,
            level: parent.level + 1,
            createdBy: userId,
            updatedBy: userId,
            deletable: true,
        });

        const addRole = await this.roleRepository.save(instanceRole);
        const attachPermission = await this.rolePermissionService.attach({ roleId: addRole.id, permissionIds, userId });

        return addRole;
    }

    async update(roleId: string, newRole: UpdateRoleDto, userId: string) {
        const { parentId, permissionIds } = newRole;

        if (parentId === roleId) {
            throw new BadRequest({ message: DataErrorCodeEnum.SELF_LINK_ROLE });
        }

        const parent = await this.isExist(parentId);
        if (!parent) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PARENT_ROLE });
        }
        await this.isValidParent(parentId);

        const role = await this.isExist(roleId);
        if (!role)
            throw new BadRequest({
                message: DataErrorCodeEnum.NOT_EXIST_ROLE,
            });

        if (!role.deletable) {
            throw new BadRequest({ message: DataErrorCodeEnum.UNMODIFIABLE_ROLE });
        }
        await this.isNestedRole(roleId, parentId);

        const newRoleInfo: RoleEntity = {
            ...role,
            ...newRole,
            level: parent.level + 1,
            updatedBy: userId,
        };

        const [updateRole, attachPermisison] = await Promise.all([
            this.roleRepository.save(newRoleInfo),
            this.rolePermissionService.attach({ roleId, permissionIds, userId }),
        ]);

        return updateRole;
    }

    async softDelete(roleIds: string[]) {
        const exist = await this.roleRepository.find({ where: { id: In(roleIds) }, loadEagerRelations: false });

        if (!exist.length || exist.length !== roleIds.length) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ROLE });
        }

        if (exist.findIndex(role => !role.deletable) !== -1) {
            throw new BadRequest({ message: DataErrorCodeEnum.UNMODIFIABLE_ROLE });
        }

        const remove = exist.map(async role => {
            await this.roleRepository.softDelete(role.id);
        });

        return remove;
    }

    async hardDelete(roleIds: string[]) {
        const exist = await this.roleRepository.find({ where: { id: In(roleIds) }, loadEagerRelations: false });

        if (!exist.length || exist.length !== roleIds.length) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ROLE });
        }
        if (exist.findIndex(role => !role.deletable) !== -1) {
            throw new BadRequest({ message: DataErrorCodeEnum.CONTAIN_ROLE_UNDELETEABLE });
        }

        const remove = exist.map(role => {
            this.roleRepository.delete(role.id);
        });

        return remove;
    }
}
