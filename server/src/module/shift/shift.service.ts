import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { WorkingHourService } from '../working-hour/working-hour.service';
import { CreateShiftDto } from './dto/shift-create.dto';
import { UpdateShiftDto } from './dto/shift-update.dto';
import { ShiftEntity } from './entity/shift.entity';

@Injectable()
export class ShiftService {
    constructor(
        @InjectRepository(ShiftEntity) private readonly shiftRepository: Repository<ShiftEntity>,
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
            .orWhere('shift.end >= :end', { end });

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
        bookingStart: Date,
        bookingEnd: Date,
        start: Date,
        end: Date,
        notShiftId?: string,
    ) {
        const workingHour = await this.workingHourService.isExist(workingHourId);
        if (!workingHour) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_WORKING_HOUR });
        }

        if (start < workingHour.start || end > workingHour.end) {
            throw new BadRequest({ message: DataErrorCodeEnum.SHIFT_OUTSIDE_WORKING_HOURS });
        }

        if (start >= end) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_SHIFT_TIMES });
        }

        if (bookingStart < start || bookingEnd > end) {
            throw new BadRequest({ message: DataErrorCodeEnum.BOOKING_TIME_OUTSIDE_SHIFT });
        }

        const overlappingShifts = await this.isOverlapping(workingHourId, start, end, notShiftId);
        if (overlappingShifts.length > 0) {
            throw new BadRequest({ message: DataErrorCodeEnum.OVERLAPPING_SHIFTS });
        }
    }

    async save(employeeId: string, body: CreateShiftDto) {
        const { start, bookingEnd, bookingStart, end, workingHourId } = body;
        await this.timeCheck(workingHourId, bookingStart, bookingEnd, start, end);

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
        const { bookingEnd, bookingStart, end, start } = props;

        const isStart = await this.isShiftStart(shiftId);
        if (isStart) {
            throw new BadRequest({ message: DataErrorCodeEnum.SHIFT_STARTED });
        }

        const shift = await this.isExist(shiftId);

        await this.timeCheck(shift.workingHourId, bookingStart, bookingEnd, start, end, shiftId);

        return this.shiftRepository.save({ id: shiftId, ...props, updatedBy: employeeId });
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
    }
}
