import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { LOGGER_CONSTANT_NAME } from '../../common/constant/logger.constant';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { combineDateAndTime, isTime1Greater } from '../../shared/utils/parse-time.utils';
import { EmployeeEntity } from '../employee/entity/employee.entity';
import { AppLoggerService } from '../logger/logger.service';
import { OrderServiceItemEntity } from '../order-service-item/entity/order-service-item.entity';
import { ShiftEntity } from '../shift/entity/shift.entity';
import { CreateWorkingHourDto } from './dto/working-hour-create.dto';
import { DeleteWorkingHourDto } from './dto/working-hour-delete.dto';
import { GetWorkingHourRangeDto, OffWorkingQueryDto } from './dto/working-hour-get.dto';
import { UpdateWorkingHourDto } from './dto/working-hour-update.dto';
import { WorkingHourEntity } from './entity/working-hour.entity';

@Injectable()
export class WorkingHourService {
    private readonly logger: AppLoggerService = new AppLoggerService(
        WorkingHourService.name,
        LOGGER_CONSTANT_NAME.cron,
    );

    constructor(
        @InjectRepository(WorkingHourEntity) private readonly workingHourRepository: Repository<WorkingHourEntity>,
        @InjectRepository(OrderServiceItemEntity)
        private readonly orderServiceItemRepository: Repository<OrderServiceItemEntity>,
        @InjectRepository(EmployeeEntity) private readonly employeeRepository: Repository<EmployeeEntity>,
        @InjectRepository(ShiftEntity) private readonly shiftRepository: Repository<ShiftEntity>,
    ) {}

    async getOrderShift(shiftId: string) {
        return this.orderServiceItemRepository.find({
            where: { shiftId },
            loadEagerRelations: false,
            relations: {
                employee: {
                    userBase: {
                        userAvatar: true,
                    },
                },
                service: {
                    category: true,
                    media: {
                        media: true,
                    },
                },
                shift: true,
                order: true,
            },
            order: {
                bookingTime: SortByEnum.ASC,
            },
        });
    }

    isExistByDate(date: Date) {
        return this.workingHourRepository.findOne({
            where: { date: Equal(date) },
            loadEagerRelations: false,
        });
    }

    isExist(id: string) {
        return this.workingHourRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    async validateTime(date: Date, start: string, end: string) {
        const isValidDuration = isTime1Greater(start, end);
        if (isValidDuration) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_TIME_RANGE });
        }

        if (combineDateAndTime(date, start).getTime() - Date.now() < 0) {
            throw new BadRequest({ message: DataErrorCodeEnum.NEGATIVE_DATE });
        }

        const [startD, endDate] = [combineDateAndTime(date, start), combineDateAndTime(date, end)];

        const isOverlapShift = await this.workingHourRepository.find({
            where: {
                date: date,
                shifts: [
                    {
                        start: LessThanOrEqual(startD),
                    },
                    {
                        end: MoreThanOrEqual(endDate),
                    },
                ],
            },
            loadEagerRelations: false,
            relations: { shifts: true },
        });

        if (isOverlapShift.length) {
            throw new BadRequest({ message: DataErrorCodeEnum.WORKING_DATE_OVERLAP_SHIFT });
        }

        return { start: startD, end: endDate };
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

    async detail(id: string) {
        const workingHour = await this.workingHourRepository.findOne({
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
                shifts: true,
            },
        });

        if (!workingHour) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_WORKING_HOUR });
        }

        const mapOrderShift = await Promise.all(
            workingHour.shifts.map(async shift => {
                const bookedService = await this.getOrderShift(shift.id);
                return {
                    ...shift,
                    orderServiceItem: bookedService,
                };
            }),
        );

        return { ...workingHour, shifts: mapOrderShift } as WorkingHourEntity;
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
                        shifts: true,
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
                const { start: startCombine, end: endCombine } = await this.validateTime(date, start, end);

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

    isStart(date: Date) {
        return date.getTime() <= Date.now();
    }

    async update(employeeId: string, body: UpdateWorkingHourDto) {
        const { id, start, end } = body;

        const exist = await this.isExist(id);
        if (!exist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_WORKING_HOUR });
        }

        const { start: startCombine, end: endCombine } = await this.validateTime(exist.date, start, end);

        const isStart = this.isStart(new Date(exist.start));

        if (isStart) {
            throw new BadRequest({ message: DataErrorCodeEnum.WORKING_HOUR_START });
        }

        const instance = this.workingHourRepository.create({
            ...exist,
            start: startCombine,
            end: endCombine,
            updatedBy: employeeId,
        });

        return this.workingHourRepository.save(instance);
    }

    async toggleOffDay(employeeId: string, query: OffWorkingQueryDto) {
        const { date } = query;
        const exist = await this.workingHourRepository.findOne({
            where: {
                date: Equal(date),
            },
            loadEagerRelations: false,
        });

        const isStart = this.isStart(new Date(exist.start));

        if (isStart) {
            throw new BadRequest({ message: DataErrorCodeEnum.WORKING_HOUR_START });
        }

        if (!exist) {
            await this.workingHourRepository.save({
                date: date,
                isOff: true,
                createdBy: employeeId,
                updatedBy: employeeId,
            });
            return DataSuccessCodeEnum.OK;
        }

        await this.workingHourRepository.update(exist.id, { isOff: !exist.isOff, updatedBy: employeeId });
        return DataSuccessCodeEnum.OK;
    }

    async deleteOne(workingHourId: string) {
        const exist = await this.isExist(workingHourId);
        if (!exist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_WORKING_HOUR });
        }

        const isStart = this.isStart(new Date(exist.start));
        if (isStart) {
            throw new BadRequest({ message: DataErrorCodeEnum.WORKING_HOUR_START });
        }

        return this.workingHourRepository.delete({ id: workingHourId });
    }

    async deleteMany(employeeId: string, body: DeleteWorkingHourDto) {
        const { workingHourIds } = body;

        const deletedWorkingHour = await this.workingHourRepository.softDelete({
            id: In(workingHourIds),
            start: MoreThan(new Date()),
        });

        return DataSuccessCodeEnum.OK;
    }

    // @Cron(CRON_EXPRESSION.EVERY_SUNDAY_START)
    // async autoCreateWorkingDate() {
    //     const latestWorkingDate = await this.workingHourRepository.findOne({
    //         where: {},
    //         loadEagerRelations: false,
    //         order: { createdAt: SortByEnum.DESC },
    //         relations: { shifts: true },
    //     });

    //     if (!latestWorkingDate) return;
    //     const start = format(latestWorkingDate.start, 'HH:mm');
    //     const end = format(latestWorkingDate.end, 'HH:mm');

    //     const DAYS = 7; // a week
    //     let nextDays = new Array(DAYS).fill(null);

    //     const admin = await this.employeeRepository.findOne({
    //         where: {
    //             eRole: {
    //                 deletable: false,
    //                 title: ROLE_TITLE.admin,
    //             },
    //         },
    //         loadEagerRelations: false,
    //     });

    //     if (!admin) return;

    //     nextDays = nextDays.map((_, i) => {
    //         const workingDate = new Date(latestWorkingDate.date);
    //         workingDate.setDate(workingDate.getDate() + i + 1);
    //         const working = this.workingHourRepository.create({
    //             date: workingDate,
    //             start: new Date(`${format(workingDate, 'yyyy/MM/dd')} ${start}:00`),
    //             end: new Date(`${format(workingDate, 'yyyy/MM/dd')} ${end}:00`),
    //             isOff: false,
    //             createdBy: admin.id,
    //             updatedBy: admin.id,
    //         });

    //         const shifts = latestWorkingDate.shifts.map(shift => {
    //             const shiftStart = format(shift.start, 'HH:mm');
    //             const shiftEnd = format(shift.end, 'HH:mm');
    //             const shiftBookingStart = format(shift.bookingStart, 'HH:mm');
    //             const shiftBookingEnd = format(shift.bookingEnd, 'HH:mm');

    //             return this.shiftRepository.create({
    //                 createdBy: admin.id,
    //                 updatedBy: admin.id,
    //                 start: new Date(`${format(workingDate, 'yyyy/MM/dd')} ${shiftStart}:00`),
    //                 end: new Date(`${format(workingDate, 'yyyy/MM/dd')} ${shiftEnd}:00`),
    //                 bookingStart: new Date(`${format(workingDate, 'yyyy/MM/dd')} ${shiftBookingStart}:00`),
    //                 bookingEnd: new Date(`${format(workingDate, 'yyyy/MM/dd')} ${shiftBookingEnd}:00`),
    //             });
    //         });
    //         return {
    //             working,
    //             shifts,
    //         };
    //     });

    //     await Promise.all(
    //         nextDays.map(async ({ working, shifts }) => {
    //             const savedWorking = await this.workingHourRepository.save(working);

    //             if (!savedWorking) return {};

    //             const savedShifts = await this.shiftRepository.save(
    //                 shifts.map((shift: any) => ({ ...shift, workingHourId: savedWorking.id })),
    //             );

    //             return {};
    //         }),
    //     );

    //     this.logger.info(`Auto create ${nextDays.length} working dates`);
    // }
}
