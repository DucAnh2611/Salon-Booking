import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { EmployeeService } from '../employee/employee.service';
import { ServiceBaseService } from '../service-base/service-base.service';
import { BodyCreateServiceEmployeeDto, ServiceEmployeeDto } from './dto/service-employee-create.dto';
import { BodyUpdateServiceEmployeeDto } from './dto/service-employee-update.dto';
import { ServiceEmpleeEntity } from './entity/service-employee.entity';

@Injectable()
export class ServiceEmployeeService {
    constructor(
        @InjectRepository(ServiceEmpleeEntity)
        private readonly serviceEmployeeRepository: Repository<ServiceEmpleeEntity>,
        private readonly serviceBaseService: ServiceBaseService,
        private readonly employeeService: EmployeeService,
    ) {}

    isExist(serviceId: string, employeeId: string) {
        return this.serviceEmployeeRepository.findOne({ where: { serviceId, employeeId }, loadEagerRelations: false });
    }

    listByServiceId(serviceId: string) {
        return this.serviceEmployeeRepository.find({ where: { serviceId }, loadEagerRelations: false });
    }

    getSnapShot(serviceId: string, employeeId: string) {
        return this.serviceEmployeeRepository.findOne({
            where: { serviceId, employeeId },
            loadEagerRelations: false,
            relations: {
                employee: {
                    userBase: {
                        userAvatar: true,
                    },
                },
            },
            order: {
                experience: SortByEnum.ASC,
            },
        });
    }

    async detailByServiceId(serviceId: string) {
        const serviceEmployees = await this.serviceEmployeeRepository.find({
            where: { serviceId },
            loadEagerRelations: false,
        });

        const list = await Promise.all(
            serviceEmployees.map(async serviceEmployee => {
                const employeeInfo = await this.employeeService.detail(serviceEmployee.employeeId);

                return {
                    ...serviceEmployee,
                    employee: employeeInfo,
                };
            }),
        );

        return list;
    }

    async saveMany(employeeId: string, body: BodyCreateServiceEmployeeDto) {
        const { employees, serviceId } = body;

        const isValid = await this.serviceBaseService.isValid(serviceId);
        if (!isValid) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE });
        }
        const save = await Promise.all(employees.map(employee => this.save(employeeId, serviceId, employee)));

        return save;
    }

    async save(employeeId: string, serviceId: string, serviceEmployee: ServiceEmployeeDto) {
        const { employeeId: sEmployeeId, experience } = serviceEmployee;

        const isExist = await this.isExist(serviceId, sEmployeeId);
        if (isExist) {
            return isExist;
        }

        const instance = this.serviceEmployeeRepository.create({
            employeeId: sEmployeeId,
            serviceId,
            experience,
            createdBy: employeeId,
            updatedBy: employeeId,
        });

        return this.serviceEmployeeRepository.save(instance);
    }

    async updateMany(employeeId: string, body: BodyUpdateServiceEmployeeDto) {
        const { employees, serviceId } = body;

        const isValid = await this.serviceBaseService.isValid(serviceId);
        if (!isValid) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE });
        }

        const listByServiceId = await this.listByServiceId(serviceId);

        const deletedList = await this.serviceEmployeeRepository.delete({
            serviceId,
            employeeId: Not(In(employees.filter(i => !!i.employeeId).map(i => i.employeeId))),
        });

        const updated = await Promise.all(employees.map(employee => this.update(employeeId, serviceId, employee)));
        return updated;
    }

    async update(employeeId: string, serviceId: string, serviceEmployee: ServiceEmployeeDto) {
        const { employeeId: sEmployeeId, experience } = serviceEmployee;

        const isExist = await this.isExist(serviceId, sEmployeeId);
        let instance = null;

        if (isExist) {
            instance = this.serviceEmployeeRepository.update(
                { serviceId, employeeId: sEmployeeId },
                {
                    ...isExist,
                    experience,
                    updatedBy: employeeId,
                },
            );
        } else {
            instance = await this.serviceEmployeeRepository.save({
                serviceId,
                employeeId: sEmployeeId,
                experience,
                updatedBy: employeeId,
                createdBy: employeeId,
            });
        }

        return instance;
    }
}
