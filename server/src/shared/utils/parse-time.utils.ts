import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { BadRequest } from '../exception/error.exception';

export const ParseTimeHourMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);

    if (hours < 0 || hours > 24 || minutes < 0 || minutes >= 60) {
        throw new BadRequest({ message: DataErrorCodeEnum.INVALID_TIME_FORMAT });
    }

    if (hours === 24 && minutes !== 0) {
        throw new BadRequest({ message: DataErrorCodeEnum.INVALID_TIME_FORMAT });
    }

    return {
        hours,
        minutes,
    };
};

export const isTime1Greater = (time1: string, time2: string) => {
    const startDate = ParseTimeHourMinutes(time1);
    const endDate = ParseTimeHourMinutes(time2);

    const startTotalMinutes = startDate.hours * 60 + startDate.minutes;
    const endTotalMinutes = endDate.hours * 60 + endDate.minutes;

    return startTotalMinutes > endTotalMinutes;
};

export const combineDateAndTime = (datetime: Date, time: string) => {
    const date = new Date(datetime);

    if (isNaN(date.getTime())) {
        throw new BadRequest({ message: DataErrorCodeEnum.INVALID_TIME_FORMAT });
    }

    const { hours, minutes } = ParseTimeHourMinutes(time);

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
};

export const getDatePlusMinutes = (minutes: number) => {
    const now = new Date();
    return new Date(now.getTime() + minutes * 60000);
};
