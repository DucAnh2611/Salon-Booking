import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { RequestErrorCodeEnum } from '../../common/enum/request-error-code.enum';
import { BadRequest, InternalServer } from '../../shared/exception/error.exception';
import { AddNewRoleDto } from './dto/create-role.dto';
import { FindRoleDto } from './dto/get-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entity/role.entity';
import { TRoleGetRoleQuery } from './type/role.type';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    async getCacheRole() {}

    async getAll() {
        return this.roleRepository.find();
    }

    async getById(roleId: string) {
        const role = await this.roleRepository.findOneBy({ id: roleId });
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
        const { title, level, description } = newRole;

        const instanceRole = this.roleRepository.create({
            title,
            createdBy: userId,
            updatedBy: userId,
            deletable: true,
            level,
            description,
        });

        const addRole = await this.roleRepository.save(instanceRole);
        if (!addRole) throw new InternalServer({ message: DataErrorCodeEnum.INTERNAL });

        return addRole;
    }

    async update(roleId: string, newRole: UpdateRoleDto, userId: string) {
        const { title, level, description } = newRole;

        const role = await this.getRole({ id: roleId });
        if (!role)
            throw new BadRequest({
                requestCode: RequestErrorCodeEnum.BAD_GATEWAY,
                message: DataErrorCodeEnum.NOT_EXIST,
            });

        const newRoleInfo: RoleEntity = {
            ...role,
            title: title || role.title,
            updatedBy: userId,
            level: level || role.level,
            description: description || role.description,
        };

        const updateRole = await this.roleRepository.save(newRoleInfo);
        if (!updateRole) throw new InternalServer({ message: DataErrorCodeEnum.INTERNAL });

        return updateRole;
    }

    async softDelete(roleIds: string[]) {
        const exist = await Promise.all(roleIds.map(roleId => this.getById(roleId)));

        if (exist.findIndex(role => !role.deletable) !== -1) {
            throw new BadRequest({ message: DataErrorCodeEnum.CAN_NOT_DO_ACTION });
        }

        const remove = exist.map(async role => {
            await this.roleRepository.softDelete(role.id);
        });

        return remove;
    }

    async hardDelete(roleIds: string[]) {
        const exist = await Promise.all(roleIds.map(roleId => this.getById(roleId)));

        if (exist.findIndex(role => !role.deletable) !== -1) {
            throw new BadRequest({ message: DataErrorCodeEnum.CAN_NOT_DO_ACTION });
        }

        const remove = exist.map(role => {
            this.roleRepository.delete(role.id);
        });

        return remove;
    }
}
