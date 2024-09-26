import { ReactNode, useEffect, useState } from "react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface IDatePickerProps {
    value?: Date;
    onChange: (date: Date | null) => void;
    fromDate?: Date;
    trigger: ReactNode;
}

export default function DatePicker({
    value,
    fromDate,
    onChange,
    trigger,
}: IDatePickerProps) {
    const [date, SetDate] = useState<Date | undefined>(value);

    const handleChange = (date: Date | undefined) => {
        onChange(date || null);
        SetDate(date);
    };

    useEffect(() => {
        SetDate(value);
    }, [value]);

    return (
        <Popover>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleChange}
                    fromDate={fromDate}
                />
            </PopoverContent>
        </Popover>
    );
}
