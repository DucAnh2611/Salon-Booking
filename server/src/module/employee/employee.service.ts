import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { ROLE_TITLE } from '../../common/constant/role.constant';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { EmployeeStatusEnum } from '../../common/enum/employee.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { BadRequest, InternalServer } from '../../shared/exception/error.exception';
import { ParseOrderString } from '../../shared/utils/parse-dynamic-queyry.utils';
import { trimStringInObject } from '../../shared/utils/trim-object.utils';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';
import { CreateEmployeeDto } from './dto/create-emplotee.dto';
import { FindEmployeeQueryDto } from './dto/get-employee.dto';
import { ResetEmployeePasswordDto, UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeEntity } from './entity/employee.entity';
import { TQueryExistEmployee } from './type/is-exist.type';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(EmployeeEntity) private readonly employeeRepository: Repository<EmployeeEntity>,
        private readonly roleService: RoleService,
        private readonly userService: UserService,
    ) {}

    getMyInfo(id: string) {
        return this.employeeRepository.findOne({
            where: { id },
            loadEagerRelations: false,
            relations: {
                userBase: {
                    userAvatar: true,
                },
            },
        });
    }

    async getById(id: string) {
        return this.employeeRepository.findOneBy({ id });
    }

    getSnapshot(id: string) {
        return this.employeeRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    async detail(id: string): Promise<Promise<EmployeeEntity>> {
        const employee = await this.employeeRepository.findOne({
            where: { id },
            loadEagerRelations: false,
            relations: {
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
                eRole: true,
            },
        });
        if (!employee) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_EMPLOYEE });
        }

        const user = await this.userService.getDetailUser(employee.userId);

        return {
            ...employee,
            userBase: user,
        };
    }

    async findEmployee(query: FindEmployeeQueryDto) {
        const { key, orderBy, page, limit } = query;

        const order = orderBy ? ParseOrderString(orderBy) : { createdBy: SortByEnum.ASC };

        const [items, count] = await this.employeeRepository.findAndCount({
            where: [
                { username: Like(`%${key}%`) },
                { userBase: { firstname: Like(`%${key}%`) } },
                { userBase: { lastname: Like(`%${key}%`) } },
            ],
            loadEagerRelations: false,
            relations: {
                userCreate: true,
                userUpdate: true,
                userBase: {
                    userAvatar: true,
                },
                eRole: true,
            },
            order: {
                ...order,
            },
        });
        return { items, page, limit, count };
    }

    async isExist({ username }: TQueryExistEmployee) {
        const employee = await this.employeeRepository.findOne({ where: { username }, loadEagerRelations: false });

        return employee;
    }

    async isExistById(id: string) {
        return this.employeeRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    async createEmployee(employeeId: string, newEmployee: CreateEmployeeDto) {
        const { username, eRoleId, ...userInfo } = trimStringInObject<CreateEmployeeDto>(newEmployee);
        const [{ id: roleId }, eRole, clientRole] = await Promise.all([
            this.roleService.getRole({ title: ROLE_TITLE.staff }),
            this.roleService.getById(eRoleId),
            this.roleService.getRole({ title: ROLE_TITLE.client }),
        ]);

        if (!eRole || eRoleId === clientRole.id) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_STAFF_ROLE });
        }

        // check is eRoleId is employee id (level lower than level of staff)
        await this.roleService.isValidParent(eRoleId);

        const createdUser = await this.userService.create({ ...userInfo, roleId });
        if (!createdUser) throw new InternalServer();

        const { id: createdUserId } = createdUser;

        const newEmployeeInstance = this.employeeRepository.create({
            username: username,
            eRoleId,
            userId: createdUserId,
            createdBy: employeeId,
            updatedBy: employeeId,
            status: EmployeeStatusEnum.AVAILABLE,
        });

        const createdEmployee = await this.employeeRepository.save(newEmployeeInstance);
        if (!createdEmployee) throw new InternalServer();

        return createdEmployee;
    }

    async updateEmployee({
        requestEmployeeId,
        targetEmployeeId,
        newInfo,
    }: {
        requestEmployeeId: string;
        targetEmployeeId: string;
        newInfo: UpdateEmployeeDto;
    }) {
        const { lastname, firstname, gender, avatar, phone, birthday, ...employee } = newInfo;
        const employeeInfo = await this.getById(targetEmployeeId);
        if (!employeeInfo) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_EMPLOYEE });
        }

        const [employeeRole, roleAdmin] = await Promise.all([
            this.employeeRepository.findOne({
                where: { id: targetEmployeeId },
                loadEagerRelations: false,
                relations: {
                    eRole: true,
                },
            }),
            this.roleService.getRole({ title: ROLE_TITLE.admin }),
        ]);

        if (employeeRole.eRole.id === roleAdmin.id && employee.eRoleId !== roleAdmin.id) {
            throw new BadRequest({ message: DataErrorCodeEnum.CAN_NOT_CHANGE_ADMIN_ROLE });
        } else if (employeeRole.eRole.id !== roleAdmin.id) {
            // check is eRoleId is employee roleid (level lower than level of staff)
            await this.roleService.isValidParent(employee.eRoleId);
        }

        const updateUser = await this.userService.update(employeeInfo.userId, {
            lastname,
            firstname,
            gender,
            avatar: avatar || null,
            phone,
            birthday,
        });

        const newEmployeeInfo: EmployeeEntity = {
            ...employeeInfo,
            ...employee,
            updatedBy: requestEmployeeId,
        };

        const updateEmployee = await this.employeeRepository.save(newEmployeeInfo);

        return {
            ...updateEmployee,
            userBase: updateUser,
        };
    }

    async delete(employeeId: string, ids: string[]) {
        const exist = await this.employeeRepository.find({
            where: { id: In(ids) },
            loadEagerRelations: false,
            relations: { eRole: true },
        });
        if (!exist.length) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_EMPLOYEE });
        }
        if (exist.some(emp => emp.id === employeeId)) {
            throw new BadRequest({ message: DataErrorCodeEnum.SELF_DELETE_EMPLOYEE });
        }

        if (exist.some(emp => emp.eRole.title === ROLE_TITLE.admin)) {
            throw new BadRequest({ message: DataErrorCodeEnum.DELETE_ADMIN });
        }

        await this.employeeRepository.softDelete({ id: In(ids) });
        return DataSuccessCodeEnum.OK;
    }

    async resetEmpPassword(requestId: string, body: ResetEmployeePasswordDto) {
        const { password, id: targetId } = body;

        const [employeeRole, target, roleAdmin] = await Promise.all([
            this.employeeRepository.findOne({
                where: { id: requestId },
                loadEagerRelations: false,
                relations: {
                    eRole: true,
                },
            }),
            this.employeeRepository.findOne({
                where: { id: targetId },
                loadEagerRelations: false,
            }),
            this.roleService.getRole({ title: ROLE_TITLE.admin }),
        ]);

        if (!target) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_EMPLOYEE });
        }

        if (employeeRole.eRole.id !== roleAdmin.id) {
            throw new BadRequest({ message: DataErrorCodeEnum.CAN_NOT_DO_ACTION });
        }

        const update = await this.userService.update(target.userId, { password });

        return DataSuccessCodeEnum.OK;
    }
}
