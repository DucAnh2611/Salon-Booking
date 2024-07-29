import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { combineDateAndTime, isTime1Greater } from '../../shared/utils/parse-time.utils';
import { CreateWorkingHourDto } from './dto/working-hour-create.dto';
import { DeleteWorkingHourDto } from './dto/working-hour-delete.dto';
import { GetWorkingHourRangeDto } from './dto/working-hour-get.dto';
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

    validateTime(date: Date, start: string, end: string) {
        const isValidDuration = isTime1Greater(start, end);
        if (isValidDuration) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_TIME_RANGE });
        }

        const currDate = new Date().getDate();
        if (date.getUTCDate() - currDate < 0) {
            throw new BadRequest({ message: DataErrorCodeEnum.NEGATIVE_DATE });
        }

        return { start: combineDateAndTime(date, start), end: combineDateAndTime(date, end) };
    }

    getDatesBetween(startDate: Date, endDate: Date) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const dates = [];

        for (let dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
            dates.push(new Date(dt));
        }

        return dates;
    }

    getWorkingHourAtDate(datetime: Date) {
        const year = datetime.getFullYear();
        const month = datetime.getMonth();
        const date = datetime.getDate();

        const newDate = new Date(year, month, date);

        return this.workingHourRepository.findOne({
            where: {
                date: Equal(newDate),
            },
            loadEagerRelations: false,
        });
    }

    detail(id: string) {
        const workingHour = this.workingHourRepository.findOne({
            where: { id },
            loadEagerRelations: false,
            relations: {
                userCreate: {
                    userBase: true,
                },
                userUpdate: {
                    userBase: true,
                },
                shifts: true,
            },
        });
        if (!workingHour) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_WORKING_HOUR });
        }

        return workingHour;
    }

    async getRange(range: GetWorkingHourRangeDto) {
        const { endDate, fromDate } = range;
        const countDate = this.getDatesBetween(fromDate, endDate);
        if (!countDate.length) {
            return [];
        }

        const listWorkingHour = await Promise.all(
            countDate.map(date =>
                this.workingHourRepository.findOne({
                    where: { date: Equal(date) },
                    loadEagerRelations: false,
                    relations: {
                        userCreate: {
                            userBase: true,
                        },
                        userUpdate: {
                            userBase: true,
                        },
                    },
                }),
            ),
        );

        return { items: listWorkingHour, count: listWorkingHour.length };
    }

    async saveDateRange(employeeId: string, body: CreateWorkingHourDto) {
        const { dateFrom, dateEnd, end, isOff, start } = body;

        const dateList = this.getDatesBetween(dateFrom, dateEnd);
        if (!dateList.length) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_TIME_RANGE });
        }

        const listInstance = await Promise.all(
            dateList.map(async date => {
                const { start: startCombine, end: endCombine } = this.validateTime(date, start, end);

                const isExistDate = await this.isExistByDate(date);
                if (isExistDate) {
                    throw new BadRequest({ message: DataErrorCodeEnum.EXISTED_WORKING_HOUR });
                }

                const instance = this.workingHourRepository.create({
                    date,
                    isOff,
                    start: startCombine,
                    end: endCombine,
                    createdBy: employeeId,
                    updatedBy: employeeId,
                });
                return instance;
            }),
        );

        return this.workingHourRepository.save(listInstance);
    }

    async update(employeeId: string, body: UpdateWorkingHourDto) {
        const { id, start, end } = body;

        const exist = await this.isExist(id);
        if (!exist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SHIFT });
        }

        const { start: startCombine, end: endCombine } = this.validateTime(exist.date, start, end);

        if (!exist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_WORKING_HOUR });
        }

        const instance = this.workingHourRepository.create({
            ...exist,
            start: startCombine,
            end: endCombine,
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
