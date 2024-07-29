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
