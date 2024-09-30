import dayjs from "dayjs";

export enum EDateComp {
    D = "day",
    M = "month",
    Y = "year",
}

export const DateFromNow = (year: number) => {
    return DateFromTime(new Date(), year);
};

export const DateFromTime = (date: Date, year: number) => {
    const dateFrom = new Date(date);

    const pastDate = new Date(
        dateFrom.getFullYear() - year,
        dateFrom.getMonth(),
        dateFrom.getDate()
    );

    return pastDate;
};

export const getDateComponents = (date: Date): Record<EDateComp, number> => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return { day: day || 1, month: month || 1, year: year || 1900 };
};

export const mergeDateComponents = ({
    day,
    month,
    year,
}: Record<EDateComp, number>): Date | null => {
    if (month < 1 || month > 12) {
        return null;
    }

    const maxDay = new Date(year, month, 0).getDate();
    if (day < 1 || day > maxDay) {
        return null;
    }

    return new Date(year, month - 1, day);
};

export const getDayPercent = (date: Date) => {
    const moment = new Date(date);

    const secondsSinceMidnight =
        moment.getHours() * 3600 +
        moment.getMinutes() * 60 +
        moment.getSeconds();

    const totalSecondsInDay = 24 * 3600;

    const dayPercentage = (secondsSinceMidnight / totalSecondsInDay) * 100;

    return Math.ceil(dayPercentage);
};

export const formatTimeToHHMM = (date: Date) => {
    const newDate = new Date(date);

    let hours = newDate.getHours();
    let minutes = newDate.getMinutes();

    let parsedHours = hours < 10 ? "0" + hours : hours;
    let parsedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `${parsedHours}:${parsedMinutes}`;
};

export const parseHHMMToTime = (time: string) => {
    const isValidFormat = /^(0?\d|1\d|2[0-3]):([0-5]\d|[0-5]?\d)$/.test(time);

    if (!isValidFormat) {
        return { hours: 0, minutes: 0 };
    }

    const [hours, minutes] = time.split(":").map(Number);

    return { hours, minutes };
};

export const calculateTimeRangePercentage = (
    parentStart: Date,
    parentEnd: Date,
    childStart: Date,
    childEnd: Date
) => {
    const parentStartDate = new Date(parentStart);
    const parentEndDate = new Date(parentEnd);
    const childStartDate = new Date(childStart);
    const childEndDate = new Date(childEnd);

    const parentDuration = parentEndDate.getTime() - parentStartDate.getTime();
    const childDuration = childEndDate.getTime() - childStartDate.getTime();

    const percentage = (childDuration / parentDuration) * 100;

    return Math.ceil(percentage);
};

export const formatTimeDifference = (startDate: Date, endDate: Date) => {
    const diffMs = Math.abs(endDate.getTime() - startDate.getTime());

    const seconds = Math.floor((diffMs / 1000) % 60);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let result = "";

    if (days > 0) {
        result += `${days} ngày `;
    }
    if (hours > 0) {
        result += `${hours} giờ `;
    }
    if (minutes > 0 || (days === 0 && hours === 0)) {
        result += `${minutes} phút `;
    }
    if (seconds > 0 || (days === 0 && hours === 0 && minutes === 0)) {
        result += `${seconds} giây`;
    }

    return result.trim();
};

export const getTimeDifference = (
    date1: Date,
    date2: Date
): { minutes: number; seconds: number } => {
    const diffInMs = Math.abs(date2.getTime() - date1.getTime());
    const totalSeconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return { minutes, seconds };
};

export const calculateYearsAgo = (year: number) => {
    const fifteenYearsAgo = dayjs().subtract(year, "year").toDate();

    return fifteenYearsAgo;
};

export const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
};

export const getNumberOfMonthsInYear = (year: number) => {
    const now = new Date();
    const currentYear = now.getFullYear();

    if (year === currentYear) {
        return now.getMonth() + 1;
    } else {
        return 12;
    }
};
