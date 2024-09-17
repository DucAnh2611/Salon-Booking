"use client";

import useDebounce from "@/hook/useDebounce.hook";
import { Minus, Plus } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface IQuantityButtonProps {
    value: number;
    onChange: (value: number) => void;
}

export default function QuantityButton({
    value,
    onChange,
}: IQuantityButtonProps) {
    const [iValue, SetIValue] = useState<number>(value);
    const { debouncedValue } = useDebounce(iValue);

    const setIValue = (v: number) => () => {
        SetIValue(v < 1 ? 1 : v);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const v = parseInt(e.target.value) || 1;

        SetIValue(v);
    };

    useEffect(() => {
        if (value !== debouncedValue) {
            onChange(debouncedValue);
        }
    }, [debouncedValue]);

    return (
        <div className="flex border rounded-md w-fit overflow-hidden hide-arrows">
            <Button
                size="icon"
                variant="outline"
                className="border-transparent rounded-none"
                onClick={setIValue(iValue - 1)}
            >
                <Minus size={15} />
            </Button>
            <Input
                type="number"
                value={iValue}
                onChange={handleChange}
                className="border-transparent rounded-none w-10 px-3 text-center border-l-muted border-r-muted focus-visible:ring-transparent"
            />
            <Button
                size="icon"
                variant="outline"
                className="border-transparent rounded-none"
                onClick={setIValue(iValue + 1)}
            >
                <Plus size={15} />
            </Button>
        </div>
    );
}
