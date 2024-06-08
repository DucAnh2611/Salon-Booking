import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ROLE_TITLE } from '../../common/constant/role.constant';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { ConvertOperator } from '../../common/util/convert-operator.utils';
import { Forbidden, InternalServer } from '../../shared/exception/error.exception';
import { trimStringInObject } from '../../shared/utils/trim-object.utils';
import { EmployeeEntity } from '../role/entity/employee.entity';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';
import { CreateEmployeeDto } from './dto/create-emplotee.dto';
import { FindEmployeeQueryDto } from './dto/get-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
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

    async findEmployee(query: FindEmployeeQueryDto) {
        const { filter, limit, page, sort } = query;
        const querybuilder = this.employeeRepository.createQueryBuilder('employee');

        querybuilder.leftJoinAndSelect('employee.eRole', 'role').select(['employee', 'employee.*', 'role', 'role.*']);

        filter.forEach(({ field, operator, value }, id) => {
            const convertedQuery = ConvertOperator({ field, operator, value });
            if (id === 0) {
                querybuilder.where(convertedQuery.where, { [convertedQuery.field]: convertedQuery.value });
            } else querybuilder.andWhere(convertedQuery.where, { [convertedQuery.field]: convertedQuery.value });
        });

        sort.forEach(({ field, sort }, id) => {
            if (id === 0) {
                querybuilder.orderBy(field, sort);
            } else querybuilder.addOrderBy(field, sort);
        });

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
        const querybuilder = this.employeeRepository.createQueryBuilder('employee');

        const employee = await querybuilder
            .innerJoinAndSelect('employee.eRole', 'role')
            .where('employee.username = :username', { username })
            .getOne();

        return employee;
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
        const { id: roleId } = await this.roleService.getRole({ title: ROLE_TITLE.staff });

        const createdUser = await this.userService.create({ ...userInfo, roleId });
        if (!createdUser) throw new InternalServer({ message: DataErrorCodeEnum.INTERNAL });

        const { id: createdUserId } = createdUser;

        const newEmployeeInstance = this.employeeRepository.create({
            username: username,
            eRoleId,
            userId: createdUserId,
            createdBy: employeeId,
            updatedBy: employeeId,
        });
        const createdEmployee = await this.employeeRepository.save(newEmployeeInstance);
        if (!createdEmployee) throw new InternalServer({ message: DataErrorCodeEnum.INTERNAL });

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

        //TODO - When have background of employee add method for it
        // const { lastname, firstname, gender } = newInfo;
        const employeeInfo = await this.getById(targetEmployeeId);

        const newEmployeeInfo = {
            ...employeeInfo,
            // ...newInfo,
        };

        const updateEmployee = await this.employeeRepository.save(newEmployeeInfo);
        if (!updateEmployee) {
            throw new InternalServer({ message: DataErrorCodeEnum.INTERNAL });
        }

        return 'ok';
    }
}
