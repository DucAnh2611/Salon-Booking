"use client";

import { CANCEL_ORDER_REASON } from "@/constant/cancel.constant";
import { ICancelOrderReason } from "@/interface/cancel.interface";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

interface ISelectCancelRefundProps {
    onSelect: (value: ICancelOrderReason | null) => void;
    value: ICancelOrderReason | null;
}

export default function SelectCancelOrderReason({
    value,
    onSelect,
}: ISelectCancelRefundProps) {
    const [valueSelected, SetValueSelected] =
        useState<ICancelOrderReason | null>(null);

    const handleChangeStatus = (value: string) => {
        const getReason =
            CANCEL_ORDER_REASON.find((i) => i.id === value) || null;

        onSelect(getReason);
        SetValueSelected(getReason);
    };

    useEffect(() => {
        SetValueSelected(value);
    }, [value]);

    return (
        <Select
            onValueChange={handleChangeStatus}
            value={valueSelected ? valueSelected.id : "no"}
        >
            <SelectTrigger>
                {valueSelected ? valueSelected.value : "Không"}
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={"no"}>Không</SelectItem>
                {CANCEL_ORDER_REASON.map((reason) => (
                    <SelectItem value={reason.id} key={reason.id}>
                        {reason.value}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
