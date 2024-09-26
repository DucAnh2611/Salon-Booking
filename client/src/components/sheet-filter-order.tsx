"use client";

import {
    ORDER_PAYMENT_TYPE,
    ORDER_STATUS,
    ORDER_TYPE,
} from "@/constant/order.constant";
import { EOrderPaymentType, EOrderStatus, EOrderType } from "@/enum/order.enum";
import useOrderList from "@/hook/useOrderList";
import { IListOrderFilter } from "@/interface/order.interface";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Filter, XIcon } from "lucide-react";
import { useState } from "react";
import DatePicker from "./date-picker";
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

interface ISheetFilterOrderProps {}

export default function SheetFilterOrder({}: ISheetFilterOrderProps) {
    const { filter, setSearchBody, page, limit, order } = useOrderList();

    const [newFilter, SetNewFilter] = useState<IListOrderFilter>(filter);
    const [open, SetOpen] = useState<boolean>(false);

    const handleSelectPaymentType =
        (paymentTypeNew?: EOrderPaymentType) => () => {
            let { paymentType, ...filterProps } = newFilter;

            SetNewFilter({
                ...filterProps,
                ...(paymentTypeNew !== undefined
                    ? { paymentType: paymentTypeNew }
                    : {}),
            });
        };

    const handleSelectType = (typeNew?: EOrderType) => () => {
        let { type, ...filterProps } = newFilter;

        SetNewFilter({
            ...filterProps,
            ...(typeNew !== undefined ? { type: typeNew } : {}),
        });
    };

    const handleSelectPaid = (paidNew?: boolean) => () => {
        let { paid, ...filterProps } = newFilter;

        SetNewFilter({
            ...filterProps,
            ...(paidNew !== undefined ? { paid: paidNew } : {}),
        });
    };

    const handleSelectStatus = (statusNew?: EOrderStatus) => () => {
        let { status, ...filterProps } = newFilter;

        SetNewFilter({
            ...filterProps,
            ...(statusNew !== undefined ? { status: statusNew } : {}),
        });
    };

    const handleChangeCreatedAt =
        (type: "from" | "to") => (date: Date | null) => {
            SetNewFilter((f) => {
                if (date && f.to && type === "from" && date > f.to) {
                    f.to = date;
                }

                const { [type]: fieldValue, ...props } = f;

                return {
                    ...props,
                    ...(date ? { [type]: date } : {}),
                };
            });
        };

    const handleConfirm = () => {
        setSearchBody({
            filter: newFilter,
            page,
            limit,
            order,
        });
        SetOpen(false);
    };

    const onClose = (open: boolean) => {
        if (open) {
            SetNewFilter(filter);
        }
        SetOpen(open);
    };

    const reset = () => {
        SetNewFilter({});
        setSearchBody({
            filter: {},
            page,
            limit,
            order,
        });
        SetOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Filter size={15} /> Bộ lọc
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col items-start justify-start gap-0 !max-w-none w-[500px]">
                <SheetHeader>
                    <SheetTitle>Bộ lọc đơn hàng</SheetTitle>
                    <SheetDescription>
                        Giúp tìm kiếm đơn hàng dễ dàng hơn
                    </SheetDescription>
                </SheetHeader>
                <Separator orientation="horizontal" className="mb-5" />
                <div className="flex-1 w-full overflow-y-auto items-start">
                    <div className="mb-5 ">
                        <Separator orientation="horizontal" />
                        <p className="text-base font-medium my-2">
                            Trạng thái đơn hàng
                        </p>
                        <div className="flex gap-2 flex-wrap mt-2">
                            <Button
                                variant={
                                    newFilter.status === undefined
                                        ? "default"
                                        : "outline"
                                }
                                onClick={handleSelectStatus()}
                            >
                                Không
                            </Button>
                            {Object.entries(EOrderStatus).map(
                                ([key, value]) => (
                                    <Button
                                        key={key}
                                        variant={
                                            newFilter.status !== undefined &&
                                            newFilter.status ===
                                                (value as EOrderStatus)
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={handleSelectStatus(
                                            value as EOrderStatus
                                        )}
                                    >
                                        {ORDER_STATUS[value as EOrderStatus]}
                                    </Button>
                                )
                            )}
                        </div>
                    </div>
                    <div className="mb-5 ">
                        <Separator orientation="horizontal" />
                        <p className="text-base font-medium my-2">
                            Loại đơn hàng
                        </p>
                        <div className="flex gap-2 flex-wrap mt-2">
                            <Button
                                variant={
                                    !newFilter.type ? "default" : "outline"
                                }
                                onClick={handleSelectType()}
                            >
                                Không
                            </Button>
                            {Object.entries(EOrderType).map(([key, value]) => (
                                <Button
                                    key={key}
                                    variant={
                                        newFilter.type &&
                                        newFilter.type === (value as EOrderType)
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={handleSelectType(
                                        value as EOrderType
                                    )}
                                >
                                    {ORDER_TYPE[value as EOrderType]}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-5 ">
                        <Separator orientation="horizontal" />
                        <p className="text-base font-medium my-2">
                            Phương thức thanh toán
                        </p>
                        <div className="flex gap-2 flex-wrap mt-2">
                            <Button
                                variant={
                                    !newFilter.paymentType
                                        ? "default"
                                        : "outline"
                                }
                                onClick={handleSelectPaymentType()}
                            >
                                Không
                            </Button>
                            {Object.entries(EOrderPaymentType).map(
                                ([key, value]) => (
                                    <Button
                                        key={key}
                                        variant={
                                            newFilter.paymentType &&
                                            newFilter.paymentType ===
                                                (value as EOrderPaymentType)
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={handleSelectPaymentType(
                                            value as EOrderPaymentType
                                        )}
                                    >
                                        {
                                            ORDER_PAYMENT_TYPE[
                                                value as EOrderPaymentType
                                            ]
                                        }
                                    </Button>
                                )
                            )}
                        </div>
                    </div>
                    <div>
                        <Separator orientation="horizontal" />
                        <p className="text-base font-medium my-2">
                            Tình trạng thanh toán
                        </p>
                        <div className="flex gap-2 flex-wrap mt-2">
                            <Button
                                variant={
                                    newFilter.paid === undefined
                                        ? "default"
                                        : "outline"
                                }
                                onClick={handleSelectPaid()}
                            >
                                Không
                            </Button>
                            <Button
                                variant={
                                    newFilter.paid !== undefined &&
                                    !newFilter.paid
                                        ? "default"
                                        : "outline"
                                }
                                onClick={handleSelectPaid(false)}
                            >
                                Chưa thanh toán
                            </Button>
                            <Button
                                variant={
                                    newFilter.paid !== undefined &&
                                    newFilter.paid
                                        ? "default"
                                        : "outline"
                                }
                                onClick={handleSelectPaid(true)}
                            >
                                Đã thanh toán
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Separator orientation="horizontal" />
                        <p className="text-base font-medium my-2">
                            Ngày tạo đơn
                        </p>
                        <div className="flex gap-2 flex-col mt-2">
                            <div className="flex gap-2 items-center">
                                <p className="text-xs w-[100px] whitespace-nowrap">
                                    Từ ngày
                                </p>
                                <div className="flex-1">
                                    <DatePicker
                                        value={newFilter.from}
                                        onChange={handleChangeCreatedAt("from")}
                                        trigger={
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "justify-start text-left font-normal w-full",
                                                    !newFilter.from &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {newFilter.from ? (
                                                    format(
                                                        newFilter.from,
                                                        "dd/MM/yyyy"
                                                    )
                                                ) : (
                                                    <span>
                                                        Chọn ngày bắt đầu
                                                    </span>
                                                )}
                                            </Button>
                                        }
                                    />
                                </div>
                                {!!newFilter.from && (
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            handleChangeCreatedAt("from")(null);
                                        }}
                                    >
                                        <XIcon size={15} />
                                        Xóa
                                    </Button>
                                )}
                            </div>
                            <div>
                                <div className="flex gap-2 items-center">
                                    <p className="text-xs w-[100px] whitespace-nowrap">
                                        Tới ngày
                                    </p>
                                    <div className="flex-1">
                                        <DatePicker
                                            value={newFilter.to}
                                            onChange={handleChangeCreatedAt(
                                                "to"
                                            )}
                                            fromDate={newFilter.from}
                                            trigger={
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !newFilter.to &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {newFilter.to ? (
                                                        format(
                                                            newFilter.to,
                                                            "dd/MM/yyyy"
                                                        )
                                                    ) : (
                                                        <span>
                                                            Chọn ngày kết thúc
                                                        </span>
                                                    )}
                                                </Button>
                                            }
                                        />
                                    </div>
                                    {!!newFilter.to && (
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                handleChangeCreatedAt("to")(
                                                    null
                                                );
                                            }}
                                        >
                                            <XIcon size={15} />
                                            Xóa
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <SheetFooter className="w-full mt-5">
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
