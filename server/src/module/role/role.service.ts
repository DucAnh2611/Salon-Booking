import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { RequestErrorCodeEnum } from '../../common/enum/request-error-code.enum';
import { BadRequest, InternalServer } from '../../shared/exception/error.exception';
import { PermissionService } from '../permission/permission.service';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { AddNewRoleDto } from './dto/create-role.dto';
import { FindRoleDto } from './dto/get-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './enitty/role.entity';
import { TRoleGetRoleQuery } from './type/role.type';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly rolePermissionService: RolePermissionService,
        private readonly permissionService: PermissionService,
    ) {}

    async getById(roleId: string) {
        const role = await this.roleRepository.findOneBy({ id: roleId });
        if (!role)
            throw new BadRequest({ requestCode: RequestErrorCodeEnum.NOT_FOUND, message: DataErrorCodeEnum.NOT_EXIST });

        return role;
    }

    async getRoleId(query: TRoleGetRoleQuery) {
        const role = await this.getRole(query);
        return role.id;
    }

    getRole(query: TRoleGetRoleQuery) {
        return this.roleRepository.findOneBy(query);
    }

    async find(query: FindRoleDto) {
        const queryBuilder = this.roleRepository
            .createQueryBuilder('role')
            .where('role.title LIKE :title ', { title: `%${query.title}%` });
        const [items, count] = await Promise.all([
            queryBuilder
                .take(query.limit)
                .skip((query.page - 1) * query.limit)
                .getMany(),
            queryBuilder.getCount(),
        ]);
        return { page: query.page, limit: query.limit, count, items };
    }

    async create(newRole: AddNewRoleDto, userId: string) {
        const { title, permissions } = newRole;

        const isValidPermission = await this.permissionService.isValidPermissions(permissions);
        if (!isValidPermission)
            throw new BadRequest({
                requestCode: RequestErrorCodeEnum.BAD_REQUEST,
            });

        const instanceRole = this.roleRepository.create({
            title,
            createdBy: userId,
            updatedBy: userId,
            deletable: true,
        });

        const addRole = await this.roleRepository.save(instanceRole);
        if (!addRole) throw new InternalServer({ message: DataErrorCodeEnum.INTERNAL });

        if (permissions.length > 0) {
            await this.rolePermissionService.attach({
                roleId: addRole.id,
                permissions,
                userId,
            });
        }

        return addRole;
    }

    async update(roleId: string, newRole: UpdateRoleDto, userId: string) {
        const { title, permissions } = newRole;

        const isValidPermission = await this.permissionService.isValidPermissions(permissions);
        if (!isValidPermission)
            throw new BadRequest({
                requestCode: RequestErrorCodeEnum.BAD_REQUEST,
            });

        const role = await this.getRole({ id: roleId });
        if (!role)
            throw new BadRequest({
                requestCode: RequestErrorCodeEnum.BAD_GATEWAY,
                message: DataErrorCodeEnum.NOT_EXIST,
            });

        const updateRole = await this.roleRepository.save({ ...role, title: title || role.title, updatedBy: userId });
        if (!updateRole) throw new InternalServer({ message: DataErrorCodeEnum.INTERNAL });

        if (permissions.length > 0) {
            await this.rolePermissionService.attach({
                roleId: roleId,
                permissions,
                userId,
            });
        }

        return updateRole;
    }

    async softDelete(roleIds: string[]) {
        const exist = await Promise.all(roleIds.map(roleId => this.getById(roleId)));

        const remove = exist.map(role => {
            this.roleRepository.softDelete(role.id);
        });

        return remove;
    }

    async hardDelete(roleIds: string[]) {
        const exist = await Promise.all(roleIds.map(roleId => this.getById(roleId)));

        const remove = exist.map(role => {
            this.roleRepository.delete(role.id);
        });

        return remove;
    }
}
