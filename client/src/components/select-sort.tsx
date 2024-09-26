"use client";

import { SORT_BY } from "@/constant/order.constant";
import { ESortBy } from "@/enum/order.enum";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

interface ISelectSortProps {
    onSelect: (value: ESortBy | null) => void;
    value: ESortBy | undefined;
}

export default function SelectSort({ onSelect, value }: ISelectSortProps) {
    const [valueSelected, SetValueSelected] = useState<ESortBy | undefined>(
        value
    );

    const handleChangeSort = (value: string) => {
        onSelect(value === "no" ? null : (value as ESortBy));
        SetValueSelected(value === "no" ? undefined : (value as ESortBy));
    };

    return (
        <Select onValueChange={handleChangeSort} value={valueSelected || "no"}>
            <SelectTrigger>
                {valueSelected ? SORT_BY[valueSelected] : "Không"}
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={"no"}>Không</SelectItem>
                {Object.values(ESortBy).map((value) => (
                    <SelectItem value={value} key={value}>
                        {SORT_BY[value]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
