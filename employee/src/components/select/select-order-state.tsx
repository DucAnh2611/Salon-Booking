import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { ORDER_STATUS } from "@/constants/order.constant";
import { EOrderStatus, EOrderType } from "@/enum/order.enum";
import { listOrderState } from "@/lib/redux/actions/order-state.action";
import { orderStateSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { useEffect, useState } from "react";

interface ISelectOrderStatusProps {
    onSelect: (value: EOrderStatus | undefined) => void;
    value: EOrderStatus | undefined;
    type: EOrderType;
}

export default function SelectOrderStatus({
    onSelect,
    value,
    type,
}: ISelectOrderStatusProps) {
    const { typeState, items } = useAppSelector(orderStateSelector);
    const dispatch = useAppDispatch();

    const [valueSelected, SetValueSelected] = useState<
        EOrderStatus | undefined
    >(value);

    const handleChangeStatus = (value: string) => {
        onSelect(value === "no" ? undefined : (value as EOrderStatus));
        SetValueSelected(value === "no" ? undefined : (value as EOrderStatus));
    };

    useEffect(() => {
        if (type !== typeState) {
            dispatch(listOrderState(type));
        }
    }, [type]);

    return (
        <Select
            onValueChange={handleChangeStatus}
            value={valueSelected || "no"}
        >
            <SelectTrigger>
                {valueSelected ? ORDER_STATUS[valueSelected] : "Không"}
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={"no"}>Không</SelectItem>
                {items.map((value) => (
                    <SelectItem value={value} key={value}>
                        {ORDER_STATUS[value]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
