export const addMinutesToCurrentTime = (minutes: number) => {
    const currentTime = new Date();
    const updatedTime = new Date(currentTime.getTime() + minutes * 60 * 1000);
    return updatedTime;
};

export const dateToUnixTimestamp = (date: Date) => {
    const unixTimestamp = Math.floor(date.getTime() / 1000);

    const int32Timestamp = unixTimestamp | 0;

    return int32Timestamp;
};

export const isToday = (time: Date) => {
    const now = new Date();
    const nowDay = [now.getFullYear(), now.getMonth(), now.getDate()];
    const timeDay = [time.getFullYear(), time.getMonth(), time.getDate()];

    for (const i in nowDay) {
        if (nowDay[i] !== timeDay[i]) return false;
    }

    return true;
};
