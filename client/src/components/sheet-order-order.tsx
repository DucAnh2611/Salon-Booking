"use client";

import { ESortBy } from "@/enum/order.enum";
import useOrderList from "@/hook/useOrderList";
import { IListOrderOrder } from "@/interface/order.interface";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import SelectSort from "./select-sort";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";

interface ISheetOrderOrderProps {}

export default function SheetOrderOrder({}: ISheetOrderOrderProps) {
    const { filter, setSearchBody, page, limit, order } = useOrderList();

    const [newOrder, SetNewOrder] = useState<IListOrderOrder>(order);
    const [open, SetOpen] = useState<boolean>(false);

    const handleSelectSort =
        (field: keyof IListOrderOrder) => (value: ESortBy | null) => {
            const newO = { ...newOrder };
            if (!value) {
                delete newO[field];
            } else {
                newO[field] = value;
            }

            SetNewOrder(newO);
        };

    const handleConfirm = () => {
        setSearchBody({
            filter,
            page,
            limit,
            order: newOrder,
        });
        SetOpen(false);
    };

    const onClose = (open: boolean) => {
        if (open) {
            SetNewOrder(order);
        }
        SetOpen(open);
    };

    const reset = () => {
        SetNewOrder({});
        setSearchBody({
            filter,
            page,
            limit,
            order: {},
        });
        SetOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <SlidersHorizontal size={15} /> Sắp xếp
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col items-start justify-start gap-0">
                <SheetHeader>
                    <SheetTitle>Sắp xếp dữ liệu</SheetTitle>
                    <SheetDescription>
                        Sắp xếp dữ liệu giúp tìm kiếm hiệu quả hơn
                    </SheetDescription>
                </SheetHeader>
                <Separator orientation="horizontal" className="mb-5" />
                <div className="flex-1 w-full overflow-y-auto items-start">
                    <div className="mb-5 ">
                        <Separator orientation="horizontal" />
                        <p className="text-base font-medium my-2">
                            Sắp xếp dữ liệu
                        </p>
                        <div className="flex flex-col gap-2 flex-wrap mt-2">
                            <div className="flex gap-2 items-center justify-between">
                                <p className="flex-1 text-sm">Mã</p>
                                <div className="w-[150px]">
                                    <SelectSort
                                        value={order.code}
                                        onSelect={handleSelectSort("code")}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 items-center justify-between">
                                <p className="flex-1 text-sm">Ngày tạo</p>
                                <div className="w-[150px]">
                                    <SelectSort
                                        value={order.createdAt}
                                        onSelect={handleSelectSort("createdAt")}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 items-center justify-between">
                                <p className="flex-1 text-sm">Ngày cập nhật</p>
                                <div className="w-[150px]">
                                    <SelectSort
                                        value={order.updatedAt}
                                        onSelect={handleSelectSort("updatedAt")}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 items-center justify-between">
                                <p className="flex-1 text-sm">
                                    Tình trạng thanh toán
                                </p>
                                <div className="w-[150px]">
                                    <SelectSort
                                        value={order.paid}
                                        onSelect={handleSelectSort("paid")}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 items-center justify-between">
                                <p className="flex-1 text-sm">
                                    Tình trạng đơn hàng
                                </p>
                                <div className="w-[150px]">
                                    <SelectSort
                                        value={order.status}
                                        onSelect={handleSelectSort("status")}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 items-center justify-between">
                                <p className="flex-1 text-sm">
                                    Tình trạng hoàn đơn
                                </p>
                                <div className="w-[150px]">
                                    <SelectSort
                                        value={order.refund}
                                        onSelect={handleSelectSort("refund")}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 items-center justify-between">
                                <p className="flex-1 text-sm">Tổng tiển</p>
                                <div className="w-[150px]">
                                    <SelectSort
                                        value={order.total}
                                        onSelect={handleSelectSort("total")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <SheetFooter className="w-full">
                    <Button
                        onClick={reset}
                        variant="outline"
                        className="w-full"
                    >
                        Xóa bộ lọc
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="default"
                        className="w-full"
                    >
                        Xác nhận
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
