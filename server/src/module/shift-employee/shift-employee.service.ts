import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { ShiftEmployeeStatusEnum } from '../../common/enum/shift.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { ServiceEntity } from '../service-base/entity/service.entity';
import { ServiceEmployeeService } from '../service-employee/service-employee.service';
import { ShiftService } from '../shift/shift.service';
import { OrderServiceCheckOverlapDto } from './dto/order-service-item-get.dto';
import { BodyCreateShiftEmployeeDto, ShiftEmployeeDto } from './dto/shift-employee-create.dto';
import { DeleteShiftEmployeeDto } from './dto/shift-employee-delete.dto';
import { GetServiceShiftEmployeeDto } from './dto/shift-employee-get.dto';
import { UpdateShiftEmployeeDto } from './dto/shift-employee-update.dto';
import { ShiftEmployeeEntity } from './entity/shift-employee.entity';

@Injectable()
export class ShiftEmployeeService {
    constructor(
        @InjectRepository(ShiftEmployeeEntity)
        private readonly shiftEmployeeRepository: Repository<ShiftEmployeeEntity>,
        private readonly shiftService: ShiftService,
        private readonly serviceEmployeeService: ServiceEmployeeService,
        @InjectRepository(ServiceEntity)
        private readonly serviceRepository: Repository<ServiceEntity>,
    ) {}

    isExist(shiftId: string, employeeId: string) {
        return this.shiftEmployeeRepository.findOne({ where: { shiftId, employeeId }, loadEagerRelations: false });
    }

    listFromShiftId(shiftId: string) {
        return this.shiftEmployeeRepository.find({ where: { shiftId }, loadEagerRelations: false });
    }

    isEmployeeInShift(employeeId: string, shiftId: string) {
        return this.shiftEmployeeRepository.findOne({ where: { employeeId, shiftId }, loadEagerRelations: false });
    }

    async checkOverlapServiceEmployee(body: OrderServiceCheckOverlapDto) {
        const { services } = body;
        const sortServiceBookingtime = services.sort((a, b) => a.bookingTime.getTime() - b.bookingTime.getTime());

        await Promise.all(
            sortServiceBookingtime.map(async (service, i) => {
                if (i < sortServiceBookingtime.length - 1) {
                    const nextService = sortServiceBookingtime[i + 1];

                    const currentServiceEndTime = await this.calculateServiceEndTime(
                        service.bookingTime,
                        service.serviceId,
                    );

                    if (nextService && currentServiceEndTime > nextService.bookingTime) {
                        throw new BadRequest({ message: DataErrorCodeEnum.OVERLAP_SERVICE_EMPLOYEE });
                    }
                }

                return true;
            }),
        );

        return true;
    }

    async getServiceEmployeeBookingTime(body: GetServiceShiftEmployeeDto) {
        const { bookingTime, serviceId, workingHourId } = body;
        const shift = await this.shiftService.getShiftFromBookingTime(bookingTime, workingHourId);
        if (!shift) {
            return [];
        }

        const serviceEmployees = await this.serviceEmployeeService.listByServiceId(serviceId);

        const shiftEmployess = await this.shiftEmployeeRepository.find({
            where: {
                shiftId: shift.id,
                employee: In(serviceEmployees.map(e => e.employeeId)),
            },
            loadEagerRelations: false,
            order: {
                status: SortByEnum.ASC,
            },
            relations: {
                employee: {
                    userBase: {
                        userAvatar: true,
                    },
                },
            },
        });

        const mapExp = await Promise.all(
            shiftEmployess.map(emp => {
                const serviceEmployee = serviceEmployees.find(se => se.employeeId === emp.employeeId);
                const selectable = emp.status === ShiftEmployeeStatusEnum.AVAILABLE;

                return {
                    ...emp,
                    experience: serviceEmployee.experience,
                    selectable,
                };
            }),
        );

        return mapExp;
    }

    async saveMany(createId: string, body: BodyCreateShiftEmployeeDto) {
        const { shiftId, assignments } = body;

        const isExistShift = await this.shiftService.isExist(shiftId);
        if (!isExistShift) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SHIFT });
        }

        const isStart = await this.shiftService.isShiftStart(shiftId);
        if (isStart) {
            throw new BadRequest({ message: DataErrorCodeEnum.SHIFT_STARTED });
        }

        return Promise.all(assignments.map(assignment => this.save(createId, shiftId, assignment)));
    }

    async save(createId: string, shiftId: string, assignment: ShiftEmployeeDto) {
        const { employeeId, status } = assignment;

        const isStart = await this.shiftService.isShiftStart(shiftId);
        if (isStart) {
            throw new BadRequest({ message: DataErrorCodeEnum.SHIFT_STARTED });
        }

        const isExist = await this.isExist(shiftId, employeeId);
        if (isExist) {
            return this.shiftEmployeeRepository.save({
                ...isExist,
                status,
                updatedBy: createId,
            });
        }

        const instance = this.shiftEmployeeRepository.create({
            shiftId,
            employeeId,
            status,
            createdBy: createId,
            updatedBy: createId,
        });

        return this.shiftEmployeeRepository.save(instance);
    }

    async updateStatus(updateId: string, body: UpdateShiftEmployeeDto) {
        const { shiftId, status } = body;

        const isExist = await this.isExist(shiftId, updateId);
        if (!isExist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SHIFT_ASSIGNMENT });
        }

        const saved = await this.shiftEmployeeRepository.save({
            ...isExist,
            status,
            updatedBy: updateId,
        });

        return saved;
    }

    async deleteOne(shiftId: string, employeeId: string) {
        const isStart = await this.shiftService.isShiftStart(shiftId);
        if (isStart) {
            throw new BadRequest({ message: DataErrorCodeEnum.SHIFT_STARTED });
        }

        const deleted = await this.shiftEmployeeRepository.delete({ shiftId, employeeId });

        return DataSuccessCodeEnum.OK;
    }

    async deleteMany(body: DeleteShiftEmployeeDto) {
        const { shiftId, employeeIds } = body;

        const isStart = await this.shiftService.isShiftStart(shiftId);
        if (isStart) {
            throw new BadRequest({ message: DataErrorCodeEnum.SHIFT_STARTED });
        }

        const deleted = await this.shiftEmployeeRepository.delete({ shiftId, employeeId: In(employeeIds) });

        return DataSuccessCodeEnum.OK;
    }

    async calculateServiceEndTime(bookingTime: Date, serviceId: string) {
        const service = await this.serviceRepository.findOne({ where: { id: serviceId }, loadEagerRelations: false });

        if (!service) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE });
        }

        const estimatedDuration = service.duration;
        const endTime = new Date(bookingTime);
        endTime.setMinutes(endTime.getMinutes() + estimatedDuration);

        return endTime;
    }
}
