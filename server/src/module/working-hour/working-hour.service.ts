import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { CreateWorkingHourDto } from './dto/working-hour-create.dto';
import { DeleteWorkingHourDto } from './dto/working-hour-delete.dto';
import { UpdateWorkingHourDto } from './dto/working-hour-update.dto';
import { WorkingHourEntity } from './entity/working-hour.entity';

@Injectable()
export class WorkingHourService {
    constructor(
        @InjectRepository(WorkingHourEntity) private readonly workingHourRepository: Repository<WorkingHourEntity>,
    ) {}

    isExistByDate(date: Date) {
        return this.workingHourRepository.findOne({
            where: { date: Equal(date) },
            loadEagerRelations: false,
        });
    }

    isExist(id: string) {
        return this.workingHourRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    getDate(start: Date, end: Date) {
        if (start.getUTCDate() === end.getUTCDate()) {
            return start.getUTCDate();
        }
        return null;
    }

    isValidDuration(start: Date, end: Date) {
        const diffTime = start.getTime() - end.getTime();
        if (diffTime >= 0) {
            return false;
        }
        return true;
    }

    async validateTime(date: Date, start: Date, end: Date) {
        const isValidDuration = this.isValidDuration(start, end);
        if (!isValidDuration) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_TIME_RANGE });
        }

        const sameDay = this.getDate(date, start);
        const dateDuration = this.getDate(start, end);

        if (!dateDuration || !sameDay) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_SAME_DAY });
        }

        const currDate = new Date().getDate();
        if (date.getUTCDate() - currDate < 0) {
            throw new BadRequest({ message: DataErrorCodeEnum.NEGATIVE_DATE });
        }

        return true;
    }

    async save(employeeId: string, body: CreateWorkingHourDto) {
        const { date, end, isOff, start } = body;

        console.log(start.toUTCString());

        await this.validateTime(date, start, end);

        const isExistDate = await this.isExistByDate(date);
        if (isExistDate) {
            throw new BadRequest({ message: DataErrorCodeEnum.EXISTED_WORKING_HOUR });
        }

        const instance = this.workingHourRepository.create({
            date,
            isOff,
            start,
            end,
            createdBy: employeeId,
            updatedBy: employeeId,
        });

        return this.workingHourRepository.save(instance);
    }

    async update(employeeId: string, body: UpdateWorkingHourDto) {
        const { id, start, end } = body;

        const exist = await this.isExist(id);
        if (!exist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SHIFT });
        }
        await this.validateTime(exist.date, start, end);

        if (!exist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_WORKING_HOUR });
        }

        const instance = this.workingHourRepository.create({
            ...exist,
            start,
            end,
            updatedBy: employeeId,
        });

        return this.workingHourRepository.save(instance);
    }

    async toggleOffDay(employeeId: string, workingHourId: string) {
        const exist = await this.isExist(workingHourId);
        if (!exist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_WORKING_HOUR });
        }

        return this.workingHourRepository.save({ id: workingHourId, isOff: !exist.isOff, updatedBy: employeeId });
    }

    async deleteOne(workingHourId: string) {
        const exist = await this.isExist(workingHourId);
        if (!exist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_WORKING_HOUR });
        }

        return this.workingHourRepository.delete({ id: workingHourId });
    }

    async deleteMany(employeeId: string, body: DeleteWorkingHourDto) {
        const { workingHourIds } = body;

        const deletedWorkingHour = await this.workingHourRepository.softDelete({ id: In(workingHourIds) });

        return DataSuccessCodeEnum.OK;
    }
}
