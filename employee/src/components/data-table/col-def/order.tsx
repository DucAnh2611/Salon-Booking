import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ORDER_PAYMENT_TYPE,
    ORDER_STATUS,
    ORDER_TYPE,
} from "@/constants/order.constant";
import { EOrderPaymentType, EOrderStatus, EOrderType } from "@/enum/order.enum";
import { IOrderList } from "@/interface/api/order.interface";
import { cn } from "@/lib";
import { formatMoney } from "@/utils/money";
import { joinString } from "@/utils/string";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const attributeClassOrderState = {
    yellow: {
        states: [EOrderStatus.PENDING],
        className:
            "bg-yellow-500 border-yellow-500 text-yellow-500 bg-opacity-15",
    },
    purple: {
        states: [EOrderStatus.RETURNED, EOrderStatus.REFUNDED],
        className:
            "bg-purple-500 border-purple-500 text-purple-500 bg-opacity-15",
    },
    blue: {
        states: [
            EOrderStatus.CONFIRMED,
            EOrderStatus.CALL_CONFIRM,
            EOrderStatus.ARRIVED,
            EOrderStatus.SHIPPED,
            EOrderStatus.PROCESSING,
            EOrderStatus.SHIPPING,
            EOrderStatus.ON_SERVICE,
        ],
        className: "bg-blue-500 border-blue-500 text-blue-500 bg-opacity-15",
    },
    green: {
        states: [EOrderStatus.RECEIVED, EOrderStatus.FINISH],
        className: "bg-green-500 border-green-500 text-green-500 bg-opacity-15",
    },
    red: {
        states: [EOrderStatus.CANCELLED],
        className: "bg-red-500 border-red-500 text-red-500 bg-opacity-15",
    },
};

export const orderColumnDef: ColumnDef<IOrderList>[] = [
    {
        id: "Mã đơn hàng",
        header: "Mã đơn hàng",
        accessorKey: "code",
        size: 10,
        enableHiding: false,
    },
    {
        id: "Loại đơn",
        header: "Loại đơn",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <Badge
                    variant={"outline"}
                    className={cn(
                        "whitespace-nowrap",
                        order.type === EOrderType.PRODUCT &&
                            "text-yellow-500 bg-yellow-500 border-yellow-500 bg-opacity-15",
                        order.type === EOrderType.SERVICE &&
                            "text-purple-500 bg-purple-500-500 border-purple-500 bg-opacity-15"
                    )}
                >
                    {ORDER_TYPE[order.type]}
                </Badge>
            );
        },
    },
    {
        id: "Tên nhận hàng",
        header: "Tên nhận hàng",
        accessorKey: "name",
    },
    {
        id: "Số điện thoại",
        header: "Số điện thoại",
        accessorKey: "phone",
    },
    {
        id: "Địa chỉ nhận hàng",
        header: "Địa chỉ nhận hàng",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <p className="w-full max-w-[250px] line-clamp-1 text-ellipsis">
                    {order.address}
                </p>
            );
        },
    },
    {
        id: "Trạng thái",
        header: "Trạng thái",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <Badge
                    variant="outline"
                    className={cn(
                        "whitespace-nowrap ",
                        Object.values(attributeClassOrderState).find(
                            ({ states }) => states.includes(order.status)
                        )?.className || ""
                    )}
                >
                    {ORDER_STATUS[order.status]}
                </Badge>
            );
        },
    },
    {
        id: "Phương thức",
        header: "Phương thức",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <Badge
                    variant={"outline"}
                    className={cn(
                        "whitespace-nowrap",
                        order.paymentType === EOrderPaymentType.BANK &&
                            "text-blue-500 bg-blue-500 border-blue-500 bg-opacity-15",
                        order.paymentType === EOrderPaymentType.CASH &&
                            "text-green-500 bg-green-500 border-green-500 bg-opacity-15"
                    )}
                >
                    {ORDER_PAYMENT_TYPE[order.paymentType]}
                </Badge>
            );
        },
    },
    {
        id: "Thanh toán",
        header: "Thanh toán",
        cell: ({ row }) => {
            const order = row.original;

            if (order.paid) {
                return (
                    <Badge
                        variant={"outline"}
                        className={cn(
                            "whitespace-nowrap",
                            "text-green-500 bg-green-500 border-green-500 bg-opacity-15"
                        )}
                    >
                        "Đã thanh toán
                    </Badge>
                );
            }

            return (
                <Badge
                    variant={"outline"}
                    className={cn(
                        "whitespace-nowrap",
                        order.paymentType === EOrderPaymentType.CASH
                            ? "text-purple-500 bg-purple-500 border-purple-500 bg-opacity-15"
                            : "text-red-500 bg-red-500 border-red-500 bg-opacity-15"
                    )}
                >
                    {order.paymentType === EOrderPaymentType.CASH
                        ? order.type === EOrderType.PRODUCT
                            ? "Khi nhận hàng"
                            : "Trực tiếp"
                        : "Chưa thanh toán"}
                </Badge>
            );
        },
    },
    {
        id: "Tổng tiền",
        header: "Tổng tiền",
        cell: ({ row }) => {
            const order = row.original;
            return <p className="">{formatMoney(order.total)}</p>;
        },
    },
    {
        id: "Thời gian đặt",
        header: "Thời gian đặt",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <p className="">
                    {format(order.orderDate, "yyyy/MM/dd HH:mm:ss")}
                </p>
            );
        },
    },
    {
        id: "Chức năng",
        header: "Chức năng",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Các chức năng</DropdownMenuLabel>
                        <DropdownMenuItem className="p-0" asChild>
                            <Button
                                className="w-full !p-2 h-fit"
                                variant="ghost"
                            >
                                <Link
                                    to={joinString({
                                        joinString: "/",
                                        strings: [order.id],
                                    })}
                                    className="w-full  text-left"
                                >
                                    Chi tiết
                                </Link>
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        enableHiding: false,
    },
];
