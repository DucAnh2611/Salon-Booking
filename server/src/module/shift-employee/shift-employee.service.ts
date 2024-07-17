import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { ShiftService } from '../shift/shift.service';
import { BodyCreateShiftEmployeeDto, ShiftEmployeeDto } from './dto/shift-employee-create.dto';
import { DeleteShiftEmployeeDto } from './dto/shift-employee-delete.dto';
import { UpdateShiftEmployeeDto } from './dto/shift-employee-update.dto';
import { ShiftEmployeeEntity } from './entity/shift-employee.entity';

@Injectable()
export class ShiftEmployeeService {
    constructor(
        @InjectRepository(ShiftEmployeeEntity)
        private readonly shiftEmployeeRepository: Repository<ShiftEmployeeEntity>,
        private readonly shiftService: ShiftService,
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

        const isExist = await this.isExist(shiftId, employeeId);
        if (isExist) {
            return isExist;
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
}
