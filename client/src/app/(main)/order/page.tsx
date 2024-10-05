"use client";

import OrderDataTable from "@/components/order-data-table/order-data-table";
import SheetFilterOrder from "@/components/sheet-filter-order";
import SheetOrderOrder from "@/components/sheet-order-order";
import { Button } from "@/components/ui/button";
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

    const handleNextPage = () => {
        setSearchBody({
            page: page + 1,
            order,
            limit,
            filter: { ...filter, code: debouncedValue },
        });
    };

    const handlePrevPage = () => {
        setSearchBody({
            page: page - 1,
            order,
            limit,
            filter: { ...filter, code: debouncedValue },
        });
    };

    useEffect(() => {
        setSearchBody({
            page,
            order,
            limit,
            filter: { ...filter, code: debouncedValue },
        });
    }, [debouncedValue]);

    document.title = "Danh sách đơn hàng";

    return (
        <div className="flex gap-5 h-fit w-full relative">
            <div className="flex-1 h-fit flex flex-col gap-2">
                <div className="flex gap-2 w-full items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <Input
                            placeholder="Mã đơn hàng"
                            className="w-[200px]"
                            onChange={handleChangeCode}
                        />
                        <SheetFilterOrder />
                        <SheetOrderOrder />
                    </div>
                    <div className="flex gap-2 items-center">
                        <p className="text-xs text-muted-foreground">
                            {count} kết quả phù hợp
                        </p>
                        <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={handlePrevPage}
                        >
                            Trang trước
                        </Button>
                        <Button
                            variant="outline"
                            disabled={page === Math.ceil(count / limit)}
                            onClick={handleNextPage}
                        >
                            Trang sau
                        </Button>
                    </div>
                </div>
                <OrderDataTable />
            </div>
        </div>
    );
}
