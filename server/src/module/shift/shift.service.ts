import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { combineDateAndTime, isTime1Greater } from '../../shared/utils/parse-time.utils';
import { ShiftEmployeeEntity } from '../shift-employee/entity/shift-employee.entity';
import { WorkingHourService } from '../working-hour/working-hour.service';
import { CreateShiftDto } from './dto/shift-create.dto';
import { GetShiftFromBookingTimeDto } from './dto/shift-get.dto';
import { UpdateShiftDto } from './dto/shift-update.dto';
import { ShiftEntity } from './entity/shift.entity';

@Injectable()
export class ShiftService {
    constructor(
        @InjectRepository(ShiftEntity) private readonly shiftRepository: Repository<ShiftEntity>,
        @InjectRepository(ShiftEmployeeEntity)
        private readonly shiftEmployeeRepository: Repository<ShiftEmployeeEntity>,
        private readonly workingHourService: WorkingHourService,
    ) {}

    isExist(shiftId: string) {
        return this.shiftRepository.findOne({ where: { id: shiftId }, loadEagerRelations: false });
    }

    isOverlapping(workingHourId: string, start: Date, end: Date, notShiftId?: string) {
        const querybuilder = this.shiftRepository.createQueryBuilder('shift');
        const query = querybuilder
            .where('shift.workingHourId = :id', { id: workingHourId })
            .andWhere('shift.start <= :start', { start })
            .andWhere('shift.end >= :end', { end });

        if (notShiftId) {
            query.andWhere('shift.id != :id', { id: notShiftId });
        }

        return query.getMany();
    }

    getShiftOverlappingBookingDate(bookingDate: Date) {
        if (bookingDate.getTime() < new Date().getTime()) {
            throw new BadRequest({ message: DataErrorCodeEnum.NEGATIVE_DATE });
        }

        return this.shiftRepository.findOne({
            where: {
                bookingStart: LessThanOrEqual(bookingDate),
                bookingEnd: MoreThanOrEqual(bookingDate),
            },
            loadEagerRelations: false,
        });
    }

    isServiceWithinShift(shiftId: string, bookingDate: Date, duration: number) {
        const serviceDuration = new Date(bookingDate);
        serviceDuration.setMinutes(bookingDate.getMinutes() + duration);

        return this.shiftRepository.findOne({
            where: {
                id: shiftId,
                bookingStart: LessThanOrEqual(bookingDate),
                bookingEnd: MoreThanOrEqual(serviceDuration),
            },
            loadEagerRelations: false,
        });
    }

    async isShiftStart(shiftId: string) {
        const isExist = await this.isExist(shiftId);
        if (!isExist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SHIFT });
        }
        return isExist.start.getTime() <= new Date().getTime();
    }

    async timeCheck(
        workingHourId: string,
        bookingStart: string,
        bookingEnd: string,
        start: string,
        end: string,
        notShiftId?: string,
    ) {
        const workingHour = await this.workingHourService.isExist(workingHourId);
        if (!workingHour) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_WORKING_HOUR });
        }

        const [startTime, endTime, bookingStartTime, bookingEndTime] = [
            combineDateAndTime(workingHour.date, start),
            combineDateAndTime(workingHour.date, end),
            combineDateAndTime(workingHour.date, bookingStart),
            combineDateAndTime(workingHour.date, bookingEnd),
        ];

        if (startTime < workingHour.start || endTime > workingHour.end) {
            throw new BadRequest({ message: DataErrorCodeEnum.SHIFT_OUTSIDE_WORKING_HOURS });
        }

        if (!isTime1Greater(end, start)) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_SHIFT_TIMES });
        }

        if (bookingStartTime < startTime || bookingEndTime > endTime) {
            throw new BadRequest({ message: DataErrorCodeEnum.BOOKING_TIME_OUTSIDE_SHIFT });
        }

        const overlappingShifts = await this.isOverlapping(workingHourId, startTime, endTime, notShiftId);
        if (overlappingShifts.length > 0) {
            throw new BadRequest({ message: DataErrorCodeEnum.OVERLAPPING_SHIFTS });
        }
        return {
            start: startTime,
            end: endTime,
            bookingStart: bookingStartTime,
            bookingEnd: bookingEndTime,
        };
    }

    async getShiftEmployee(shiftId: string) {
        const shiftEmployees = await this.shiftEmployeeRepository.find({
            where: { shiftId },
            loadEagerRelations: false,
            relations: {
                employee: {
                    userBase: {
                        userAvatar: true,
                    },
                },
            },
        });

        return shiftEmployees;
    }

    async detail(id: string) {
        const shift = await this.shiftRepository.findOne({
            where: { id },
            loadEagerRelations: false,
            relations: {
                userCreate: {
                    userBase: true,
                },
                userUpdate: {
                    userBase: true,
                },
            },
        });

        if (!shift) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SHIFT });
        }

        const shiftEmployee = await this.getShiftEmployee(id);

        return { shift, employees: shiftEmployee };
    }

    async getShiftFromBookingDate(body: GetShiftFromBookingTimeDto) {
        const { bookingDate } = body;

        const workingHour = await this.workingHourService.getWorkingHourAtDate(bookingDate);
        if (!workingHour) {
            return [];
        }

        const shifts = await this.shiftRepository.find({
            where: {
                workingHourId: workingHour.id,
            },
            loadEagerRelations: false,
        });

        return shifts;
    }

    getShiftFromBookingTime(bookingTime: Date) {
        return this.shiftRepository.findOne({
            where: { bookingStart: LessThanOrEqual(bookingTime), bookingEnd: MoreThanOrEqual(bookingTime) },
            loadEagerRelations: false,
        });
    }

    async save(employeeId: string, body: CreateShiftDto) {
        const { workingHourId } = body;
        const { start, bookingStart, bookingEnd, end } = await this.timeCheck(
            workingHourId,
            body.bookingStart,
            body.bookingEnd,
            body.start,
            body.end,
        );

        const instance = this.shiftRepository.create({
            workingHourId,
            start,
            end,
            bookingStart,
            bookingEnd,
            createdBy: employeeId,
            updatedBy: employeeId,
        });

        return this.shiftRepository.save(instance);
    }

    async update(employeeId: string, body: UpdateShiftDto) {
        const { shiftId, ...props } = body;

        const isStart = await this.isShiftStart(shiftId);
        if (isStart) {
            throw new BadRequest({ message: DataErrorCodeEnum.SHIFT_STARTED });
        }

        const shift = await this.isExist(shiftId);

        const { start, bookingStart, bookingEnd, end } = await this.timeCheck(
            shift.workingHourId,
            props.bookingStart,
            props.bookingEnd,
            props.start,
            props.end,
            shiftId,
        );

        return this.shiftRepository.save({ id: shiftId, start, end, bookingStart, bookingEnd, updatedBy: employeeId });
    }

    async deleteOne(shiftId: string) {
        const isStart = await this.isShiftStart(shiftId);
        if (isStart) {
            throw new BadRequest({ message: DataErrorCodeEnum.SHIFT_STARTED });
        }

        const deleted = await this.shiftRepository.softDelete(shiftId);

        if (!deleted.affected) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SHIFT });
        }

        return DataSuccessCodeEnum.OK;
    }
}
