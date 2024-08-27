"use client";

import { GENDER_TEXT } from "@/constant/gender.constant";
import { EGender } from "@/enum/gender.enum";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

interface ISelectGenderProps {
    onSelect: (gender: EGender) => void;
    selected: EGender | null;
}

export default function SelectGender({
    onSelect,
    selected,
}: ISelectGenderProps) {
    const [gender, SetGender] = useState<EGender | undefined>(undefined);

    const handleSelected = (gender: EGender) => {
        onSelect(gender);
    };

    useEffect(() => {
        SetGender(selected || undefined);
    }, [selected]);

    return (
        <Select onValueChange={handleSelected} value={gender}>
            <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
                {Object.values(EGender).map((gender) => (
                    <SelectItem key={gender} value={gender}>
                        {GENDER_TEXT[gender]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
