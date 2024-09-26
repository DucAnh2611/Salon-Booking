import { REASON_CANCEL_REFUND } from "@/constants/order.constant";
import { ICancelRefundReason } from "@/interface/cancel-reason.interface";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

interface ISelectCancelRefundProps {
    onSelect: (value: ICancelRefundReason | null) => void;
    value: ICancelRefundReason | null;
}

export default function SelectCancelRefundReason({
    value,
    onSelect,
}: ISelectCancelRefundProps) {
    const [valueSelected, SetValueSelected] =
        useState<ICancelRefundReason | null>(null);

    const handleChangeStatus = (value: string) => {
        const getReason =
            REASON_CANCEL_REFUND.find((i) => i.id === value) || null;

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
                {REASON_CANCEL_REFUND.map((reason) => (
                    <SelectItem value={reason.id} key={reason.id}>
                        {reason.value}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
