import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ROLE_TITLE } from '../../common/constant/role.constant';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest, Forbidden, InternalServer } from '../../shared/exception/error.exception';
import { trimStringInObject } from '../../shared/utils/trim-object.utils';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';
import { CreateEmployeeDto } from './dto/create-emplotee.dto';
import { FindEmployeeQueryDto } from './dto/get-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeEntity } from './entity/employee.entity';
import { TQueryExistEmployee } from './type/is-exist.type';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(EmployeeEntity) private readonly employeeRepository: Repository<EmployeeEntity>,
        private readonly roleService: RoleService,
        private readonly userService: UserService,
    ) {}

    async getById(id: string) {
        return this.employeeRepository.findOneBy({ id });
    }

    getSnapshot(id: string) {
        return this.employeeRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    async findEmployee(query: FindEmployeeQueryDto) {
        const { filter, limit, page, sort } = query;
        const querybuilder = this.employeeRepository.createQueryBuilder('employee');

        querybuilder.leftJoinAndSelect('employee.eRole', 'role').select(['employee', 'employee.*', 'role', 'role.*']);

        // filter.forEach(({ field, operator, value }, id) => {
        //     const convertedQuery = ConvertOperator({ field, operator, value });
        //     if (id === 0) {
        //         querybuilder.where(convertedQuery.where, { [convertedQuery.field]: convertedQuery.value });
        //     } else querybuilder.andWhere(convertedQuery.where, { [convertedQuery.field]: convertedQuery.value });
        // });

        // sort.forEach(({ field, sort }, id) => {
        //     if (id === 0) {
        //         querybuilder.orderBy(field, sort);
        //     } else querybuilder.addOrderBy(field, sort);
        // });

        if (sort.length) {
            querybuilder.groupBy('employee.id, role.id');
        }

        const count = await querybuilder.getCount();
        const items = await querybuilder
            .take(limit)
            .skip((page - 1) * limit)
            .getMany();

        return { items, page, limit, count };
    }

    async isExist({ username }: TQueryExistEmployee) {
        const employee = await this.employeeRepository.findOneBy({ username });

        return employee;
    }

    async isExistById(id: string) {
        return this.employeeRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    async checkPiority({
        requestEmployeeId,
        targetEmployeeId,
    }: {
        requestEmployeeId: string;
        targetEmployeeId: string;
    }) {
        const [requestEmployee, targetEmployee] = await Promise.all([
            this.getById(requestEmployeeId),
            this.getById(targetEmployeeId),
        ]);

        return requestEmployee.eRole.level <= targetEmployee.eRole.level;
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

        const createdUser = await this.userService.create({ ...userInfo, roleId });
        if (!createdUser) throw new InternalServer();

        const { id: createdUserId } = createdUser;

        const newEmployeeInstance = this.employeeRepository.create({
            username: username,
            eRoleId,
            userId: createdUserId,
            createdBy: employeeId,
            updatedBy: employeeId,
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
        const validForUpdate = await this.checkPiority({ requestEmployeeId, targetEmployeeId });
        if (!validForUpdate) {
            throw new Forbidden({ message: DataErrorCodeEnum.CAN_NOT_DO_ACTION });
        }

        const { lastname, firstname, gender, avatar, phone, birthday, ...employee } = newInfo;
        const employeeInfo = await this.getById(targetEmployeeId);

        if (!employeeInfo) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_EMPLOYEE });
        }

        const updateUser = await this.userService.update(employeeInfo.userId, {
            lastname,
            firstname,
            gender,
            avatar,
            phone,
            birthday,
        });

        if (employee && updateUser) {
            const newEmployeeInfo = {
                ...employeeInfo,
                ...employee,
            };

            const updateEmployee = await this.employeeRepository.save(newEmployeeInfo);
        }

        return DataSuccessCodeEnum.OK;
    }
}
