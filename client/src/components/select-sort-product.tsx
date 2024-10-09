"use client";

import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

interface ISelectSortProductProps {
    orderBy: string;
    onChange: (orderBy: string) => void;
}

export default function SelectSortProduct({
    orderBy,
    onChange,
}: ISelectSortProductProps) {
    const [value, SetValue] = useState<string>(orderBy);

    const handleOnChange = (value: string) => {
        if (value !== orderBy) {
            onChange(value === "none" ? "" : value);
        }
    };

    useEffect(() => {
        SetValue(orderBy === "" ? "none" : orderBy);
    }, [orderBy]);

    return (
        <Select onValueChange={handleOnChange} value={value}>
            <SelectTrigger>
                <SelectValue placeholder="Sắp xếp" className="w-[200px]" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="none">Không</SelectItem>

                <SelectSeparator />

                <SelectGroup>
                    <SelectItem value="price:DESC">Giá giảm dần</SelectItem>
                    <SelectItem value="price:ASC">Giá tăng dần</SelectItem>
                    <SelectItem value="name:DESC">Tên từ A-Z</SelectItem>
                    <SelectItem value="name:ASC">Tên từ Z-A</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
