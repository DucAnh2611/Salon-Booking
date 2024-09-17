"use client";

import OrderDataTable from "@/components/order-data-table/order-data-table";
import SheetFilterOrder from "@/components/sheet-filter-order";
import SheetOrderOrder from "@/components/sheet-order-order";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hook/useDebounce.hook";
import useOrderList from "@/hook/useOrderList";
import { ChangeEvent, useEffect, useState } from "react";

export default function OrderPage() {
    const { setSearchBody, filter, order, page, limit, count } = useOrderList();

    const [code, SetCode] = useState<string>("");
    const { debouncedValue } = useDebounce<string>(code);

    const handleChangeCode = (e: ChangeEvent<HTMLInputElement>) => {
        SetCode(e.target.value);
    };
    useEffect(() => {
        setSearchBody({
            page,
            order,
            limit,
            filter: { ...filter, code: debouncedValue },
        });
    }, [debouncedValue]);

    return (
        <div className="flex gap-5 h-fit w-full relative">
            <div className="flex-1 h-fit flex flex-col gap-2">
                <div className="flex gap-2 w-full items-center">
                    <Input
                        placeholder="Mã đơn hàng"
                        className="w-[200px]"
                        onChange={handleChangeCode}
                    />
                    <SheetFilterOrder />
                    <SheetOrderOrder />
                </div>
                <p className="text-xs text-muted-foreground">
                    {count} kết quả phù hợp
                </p>
                <OrderDataTable />
            </div>
        </div>
    );
}
