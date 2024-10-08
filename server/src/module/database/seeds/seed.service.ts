import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LOGGER_CONSTANT_NAME } from '../../../common/constant/logger.constant';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { AppLoggerService } from '../../logger/logger.service';
import { CreatePermissionDto } from '../../permission/dto/create-permission.dto';
import { PermissionEntity } from '../../permission/entity/permission.entity';
import { RolePermissionEntity } from '../../role-permission/entity/role-permission.entity';
import { RoleEntity } from '../../role/entity/role.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { SEED_DATA } from './constant/seed.constant';
import { TSeedEmployee, TSeedEmployeeData, TSeedRole, TSeedRolePermissionData } from './type/seed.type';

@Injectable()
export class SeedService {
    private readonly loggerSeeder: AppLoggerService = new AppLoggerService(LOGGER_CONSTANT_NAME.seed, 'Seed');

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(EmployeeEntity) private readonly employeeRepository: Repository<EmployeeEntity>,
        @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>,
        @InjectRepository(PermissionEntity) private readonly permissionRepository: Repository<PermissionEntity>,
        @InjectRepository(RolePermissionEntity)
        private readonly rolePermissionRepository: Repository<RolePermissionEntity>,
    ) {}

    async run() {
        this.loggerSeeder.info('Starting seed');

        const roles = await this.roleSeeder(SEED_DATA.role);
        const isInsertRole = this.isInsert(roles, 'Role');

        const permission = isInsertRole ? await this.permissionSeeder(SEED_DATA.permission) : [];

        const userEmployee: TSeedEmployee = isInsertRole
            ? await this.employeeSeeder(SEED_DATA.employee, roles)
            : { employees: [], users: [] };

        this.isInsert(userEmployee.users, 'Users');
        const isInsertEmp = this.isInsert(userEmployee.employees, 'Employee');

        const rolePermission =
            this.isInsert(permission, 'Permissions') && isInsertEmp
                ? await this.rolePermissionSeeder(
                      roles,
                      SEED_DATA.rolePermission,
                      permission,
                      userEmployee.employees[0].id,
                  )
                : [];

        this.isInsert(rolePermission, 'Role Permission');

        this.loggerSeeder.info('End seed!');
    }

    isInsert(data: any[], type: string) {
        if (!data.length) {
            this.loggerSeeder.info(`Failed to insert data to ${type}!`);
        } else {
            this.loggerSeeder.info(`Inserted ${data.length} record to ${type}!`);
        }
        return !!data.length;
    }

    async employeeSeeder(data: TSeedEmployeeData[], roles: RoleEntity[]) {
        const datas: TSeedEmployee = { employees: [], users: [] };

        datas.users = await Promise.all(
            data.map(async (curr: TSeedEmployeeData) => {
                const { username, role, type, ...userInfo } = curr;

                const newUser = this.userRepository.create({
                    ...userInfo,
                    type,
                });

                return this.userRepository.save(newUser);
            }),
        );

        datas.employees = await Promise.all(
            data.map((curr: TSeedEmployeeData, id: number) => {
                const { username, role, type, ...userInfo } = curr;

                if (role) {
                    const newEmp = this.employeeRepository.create({
                        username: username,
                        userId: datas.users[id].id,
                        eRoleId: roles.find(r => role === r.title).id,
                    });

                    return this.employeeRepository.save(newEmp);
                }
                return null;
            }),
        );

        return datas;
    }

    async roleSeeder(data: TSeedRole[]) {
        const list: RoleEntity[] = [];

        for (const role of data) {
            const { parent, ...info } = role;
            let parentFound = null;
            if (parent) {
                parentFound = list.find(item => item.title === parent) || null;
            }
            const newRole = await this.roleRepository.save({
                ...info,
                parentId: parentFound ? parentFound.id : null,
                level: parentFound ? parentFound.level + 1 : 1,
            });

            list.push(newRole);
        }

        return list;
    }

    async permissionSeeder(data: CreatePermissionDto[]) {
        const datas = data.map(d => this.permissionRepository.create(d));

        await this.permissionRepository.save(datas);

        return datas;
    }

    async rolePermissionSeeder(
        roles: RoleEntity[],
        seed: TSeedRolePermissionData[],
        permissions: PermissionEntity[],
        employeeId: string,
    ) {
        const datas = this.rolePermissionRepository.create(
            seed.reduce((acc: RolePermissionEntity[], curr) => {
                curr.data.forEach(d => {
                    d.action.forEach(ac => {
                        acc.push(
                            this.rolePermissionRepository.create({
                                roleId: roles.find(role => role.title === curr.role)?.id,
                                permissionId: permissions.find(
                                    permission => permission.action === ac && permission.target === d.target,
                                ).id,
                                createdBy: employeeId,
                            }),
                        );
                    });
                });

                return acc;
            }, []),
        );

        await this.rolePermissionRepository.save(datas);

        return datas;
    }
}
