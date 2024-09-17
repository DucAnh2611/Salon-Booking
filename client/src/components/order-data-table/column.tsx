import { ORDER_PAYMENT_TYPE, ORDER_STATUS } from "@/constant/order.constant";
import { EOrderPaymentType } from "@/enum/order.enum";
import { IOrderSearch } from "@/interface/order.interface";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const columnsOrderData: ColumnDef<IOrderSearch>[] = [
    {
        id: "code",
        header: "Mã đơn",
        accessorKey: "code",
    },
    {
        id: "name",
        header: "Người nhận",
        accessorKey: "name",
    },
    {
        id: "phone",
        header: "Điện thoại",
        accessorKey: "phone",
    },
    {
        id: "address",
        header: "Địa chỉ",
        accessorKey: "address",
    },
    {
        id: "paid",
        header: "Thanh toán",
        cell: ({ row }) => {
            const order = row.original;

            return (
                <div>
                    {order.paid ? (
                        <Badge variant="default">Đã thanh toán</Badge>
                    ) : (
                        <Badge variant="destructive">Chưa thanh toán</Badge>
                    )}
                </div>
            );
        },
    },
    {
        id: "refund",
        header: "Tình trạng đơn hàng",
        cell: ({ row }) => {
            const order = row.original;

            return <p>{ORDER_STATUS[order.status]}</p>;
        },
    },
    {
        id: "paymentType",
        header: "Phương thức",
        cell: ({ row }) => {
            const order = row.original;

            return <p>{ORDER_PAYMENT_TYPE[order.paymentType]}</p>;
        },
    },
    {
        id: "total",
        header: "Tổng đơn",
        cell: ({ row }) => {
            const order = row.original;

            return (
                <p>
                    {order.total.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    })}
                </p>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const order = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`order/tracking?id=${order.id}`}>
                                Chi tiết
                            </Link>
                        </DropdownMenuItem>
                        {!order.paid &&
                            order.paymentType === EOrderPaymentType.BANK && (
                                <DropdownMenuItem>Thanh toán</DropdownMenuItem>
                            )}
                        <DropdownMenuSeparator />
                        {!order.refund && (
                            <DropdownMenuItem>Hủy đơn</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
