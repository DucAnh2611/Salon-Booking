import { rangeWorkingHourApi } from "@/lib/redux/actions/working-hour.action";
import { workingHourSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
    addDays,
    endOfMonth,
    endOfWeek,
    format,
    startOfMonth,
    startOfWeek,
} from "date-fns";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import WorkingDayContext from "./working-day-context";

interface ICalendarWokingProps {
    selectedDate: Date;
}

export default function CalendarWorking({
    selectedDate,
}: ICalendarWokingProps) {
    const dispatch = useAppDispatch();
    const { workingHours, isCalling, isFailure, reload } =
        useAppSelector(workingHourSelector);

    const [dates, SetDates] = useState<Date[]>([]);
    const [dayNames] = useState<string[]>([
        "Chủ nhật",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
    ]);

    const getCalendar = (date: Date) => {
        const startMonth = startOfMonth(date);
        const endMonth = endOfMonth(date);

        dispatch(rangeWorkingHourApi(startMonth, endMonth));
    };

    const getDateList = (date: Date) => {
        const startMonth = startOfMonth(date);
        const endMonth = endOfMonth(date);
        const startCalendar = startOfWeek(startMonth);
        const endCalendar = endOfWeek(endMonth);

        const days = [];
        let day = startCalendar;

        while (day <= endCalendar) {
            days.push(day);
            day = addDays(day, 1);
        }

        return days;
    };

    const getWorkingHour = (date: Date) => {
        return (
            workingHours.find(
                (e) =>
                    e &&
                    format(e.date, "yyyy/MM/dd") === format(date, "yyyy/MM/dd")
            ) || null
        );
    };

    useEffect(() => {
        SetDates(getDateList(selectedDate));
        getCalendar(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        if (reload) {
            SetDates(getDateList(selectedDate));
            getCalendar(selectedDate);
        }
    }, [reload]);

    return (
        <div className="flex flex-col">
            {isCalling && !isFailure && (
                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center z-[1]  backdrop-blur-sm">
                    <div className="w-full h-full absolute top-0 left-0 bg-foreground opacity-20" />
                    <LoaderCircleIcon size={20} className="animate-spin" />
                </div>
            )}
            <div className="grid w-full grid-cols-7 relative">
                {dayNames.map((day) => (
                    <div
                        key={day}
                        className="w-full text-muted-foreground py-2"
                    >
                        <p className="w-full text-center text-xs font-semibold">
                            {day}
                        </p>
                    </div>
                ))}
            </div>
            <div className="grid w-full grid-cols-7 relative border">
                {dates.map((day, index) => {
                    const isCurrentMonth =
                        day >= startOfMonth(selectedDate) &&
                        day <= endOfMonth(selectedDate);

                    return (
                        <WorkingDayContext
                            key={day.getTime()}
                            day={day}
                            isCurrentMonth={isCurrentMonth}
                            workingHour={getWorkingHour(day)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
