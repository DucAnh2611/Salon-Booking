import { getDaysInMonth, getNumberOfMonthsInYear } from "@/lib/date";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

interface ISelectBirthdayProps {
    onSelect: (birthday: Date) => void;
    selected: Date;
}
type TDate = "d" | "m" | "y";

const ATLEAST_OLD = 15;

export default function SelectBirthday({
    selected,
    onSelect,
}: ISelectBirthdayProps) {
    const [date, SetDate] = useState<Date>(selected);

    const onSelectDate = (value: number, type: TDate) => {
        const newDate = date;

        switch (type) {
            case "d":
                newDate.setDate(value);
                break;
            case "m":
                newDate.setDate(date.getDate());
                newDate.setMonth(value);
                break;
            case "y":
                newDate.setDate(date.getDate());
                newDate.setMonth(date.getMonth());
                newDate.setFullYear(value);
                break;
            default:
                break;
        }

        onSelect(newDate);
    };

    useEffect(() => {
        SetDate(selected);
    }, [selected]);

    return (
        <div className="flex gap-1 items-center">
            <SelectDay
                onSelect={onSelectDate}
                year={date.getFullYear()}
                month={date.getMonth()}
                day={date.getDate()}
            />
            <SelectMonth
                onSelect={onSelectDate}
                year={date.getFullYear()}
                month={date.getMonth()}
            />
            <SelectYear onSelect={onSelectDate} year={date.getFullYear()} />
        </div>
    );
}

function SelectDay({
    day,
    month,
    year,
    onSelect,
}: {
    day: number;
    month: number;
    year: number;
    onSelect: (value: number, type: TDate) => void;
}) {
    const [selectDate, SetSelectDate] = useState<number>(day);
    const [length, SetLength] = useState<number>(0);

    const handleChange = (value: string) => {
        onSelect(parseInt(value), "d");
    };

    useEffect(() => {
        SetSelectDate(day);
        SetLength(getDaysInMonth(month + 1, year));
    }, [year, month, day]);

    return (
        <Select
            onValueChange={handleChange}
            value={selectDate.toString() || "Ngày"}
        >
            <SelectTrigger>
                <SelectValue placeholder="Ngày" />
            </SelectTrigger>
            <SelectContent>
                {new Array(length).fill("").map((_, index) => (
                    <SelectItem
                        value={(index + 1).toString()}
                        key={"year" + index}
                    >
                        {index + 1}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function SelectMonth({
    month,
    year,
    onSelect,
}: {
    month: number;
    year: number;
    onSelect: (value: number, type: TDate) => void;
}) {
    const [selectMonth, SetSelectMonth] = useState<number>(month);
    const [length, SetLength] = useState<number>(0);

    const handleChange = (value: string) => {
        onSelect(parseInt(value), "m");
    };

    useEffect(() => {
        SetSelectMonth(month);
        SetLength(getNumberOfMonthsInYear(year));
    }, [year, month]);

    return (
        <Select onValueChange={handleChange} value={selectMonth.toString()}>
            <SelectTrigger>
                <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent>
                {new Array(length).fill("").map((_, index) => (
                    <SelectItem value={index.toString()} key={"month" + index}>
                        {index + 1}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function SelectYear({
    year,
    onSelect,
}: {
    year: number;
    onSelect: (value: number, type: TDate) => void;
}) {
    const [selectYear, SetSelectYear] = useState<number>(year);

    const handleChange = (value: string) => {
        onSelect(parseInt(value), "y");
    };

    useEffect(() => {
        SetSelectYear(year);
    }, [year]);

    return (
        <Select onValueChange={handleChange} value={selectYear.toString()}>
            <SelectTrigger>
                <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
                {new Array(90).fill("").map((_, index) => (
                    <SelectItem
                        value={(
                            new Date().getFullYear() -
                            index -
                            ATLEAST_OLD
                        ).toString()}
                        key={"year" + index}
                    >
                        {new Date().getFullYear() - index - ATLEAST_OLD}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
