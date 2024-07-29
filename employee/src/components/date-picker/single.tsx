import {
    EDateComp,
    getDateComponents,
    mergeDateComponents,
} from "@/utils/date.utils";
import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "../ui/input";

interface ISingleDataPickerProps {
    onSelect: (date: Date | undefined) => void;
    selectedDate: Date | undefined;
}

export default function SingleDatePicker({
    onSelect,
    selectedDate,
}: ISingleDataPickerProps) {
    const [dateComp, SetDateComp] = useState<
        ReturnType<typeof getDateComponents>
    >(getDateComponents(selectedDate || new Date()));
    const [err, SetErr] = useState<boolean>(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement>,
        type: EDateComp
    ) => {
        const { value } = e.target;
        err && SetErr(false);

        if (dateComp[EDateComp.Y].toString().length === 4) {
            const newDateComp = {
                ...dateComp,
                [type]: parseInt(value) || 0,
            };
            const valid = mergeDateComponents(newDateComp);
            if (!valid) {
                e.target.select();
                SetErr(true);
            } else {
                onSelect(valid);
            }
        }
    };

    useEffect(() => {
        const validDate = mergeDateComponents(dateComp);
        if (
            selectedDate &&
            validDate &&
            selectedDate.getTime() !== validDate.getTime()
        ) {
            SetDateComp(getDateComponents(selectedDate));
        }
    }, [selectedDate]);

    return (
        <div>
            <div className="grid grid-cols-3 gap-1 w-full">
                <Input
                    type="text"
                    pattern="\d*"
                    placeholder="Ngày"
                    className="flex-1"
                    value={dateComp[EDateComp.D]}
                    onChange={(e) => handleChange(e, EDateComp.D)}
                    maxLength={2}
                />

                <Input
                    type="text"
                    pattern="\d*"
                    placeholder="Tháng"
                    className="flex-1"
                    value={dateComp[EDateComp.M]}
                    onChange={(e) => handleChange(e, EDateComp.M)}
                    maxLength={2}
                />

                <Input
                    type="text"
                    pattern="\d*"
                    placeholder="Năm"
                    className="flex-[3]"
                    maxLength={4}
                    value={dateComp[EDateComp.Y]}
                    onChange={(e) => handleChange(e, EDateComp.Y)}
                />
            </div>
            {err && (
                <p className="text-destructive text-xs mt-2">
                    Ngày sinh không đúng định dạng
                </p>
            )}
        </div>
    );
}
