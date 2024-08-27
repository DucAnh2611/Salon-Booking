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
