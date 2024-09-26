import dayjs from "dayjs";

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
