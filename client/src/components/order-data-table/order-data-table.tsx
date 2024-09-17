"use client";

import {
    ORDER_PAYMENT_TYPE,
    ORDER_STATUS,
    ORDER_TYPE,
} from "@/constant/order.constant";
import useOrderList from "@/hook/useOrderList";
import dayjs from "dayjs";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

interface IOrderDataTableProps {}

export default function OrderDataTable({}: IOrderDataTableProps) {
    const { orders } = useOrderList();

    return (
        <div className="h-full w-full">
            <Card className="h-full w-full box-border p-4">
                {orders.length ? (
                    <div className="h-full overflow-y-auto">
                        <div className="grid grid-cols-4 w-full h-fit gap-3">
                            {orders.map((order) => (
                                <Card
                                    key={order.id}
                                    className="group overflow-hidden"
                                >
                                    <CardHeader className="p-2 w-full bg-muted">
                                        <div className="flex justify-between items-center text-xs w-full">
                                            <div>
                                                <p className="text-primary font-medium text-sm">
                                                    Mã: {order.code}
                                                </p>
                                                <p className="mr-1 text-xs italic text-muted-foreground">
                                                    {
                                                        ORDER_PAYMENT_TYPE[
                                                            order.paymentType
                                                        ]
                                                    }
                                                </p>
                                            </div>
                                            {!order.paid ? (
                                                <Badge variant={"destructive"}>
                                                    Chưa thanh toán
                                                </Badge>
                                            ) : (
                                                <Badge variant="default">
                                                    Đã thanh toán
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <Separator orientation="horizontal" />
                                    <CardContent className="p-2">
                                        <div className="flex justify-between items-center text-xs w-full">
                                            <p className="text-sm">
                                                {ORDER_TYPE[order.type]}
                                            </p>
                                            <p className="font-medium text-primary">
                                                {ORDER_STATUS[order.status]}
                                            </p>
                                        </div>
                                        <Separator
                                            orientation="horizontal"
                                            className="my-2"
                                        />
                                        <div className="flex flex-col gap-0.5 w-full">
                                            <p className="text-sm">
                                                <b className="mr-1">
                                                    Người nhận:
                                                </b>
                                                {order.name}
                                            </p>
                                            <p className="text-sm">
                                                <b className="mr-1">SĐT:</b>
                                                {order.phone}
                                            </p>
                                            <p className="text-sm">
                                                <b className="mr-1">Địa chỉ:</b>
                                                {order.address}
                                            </p>
                                        </div>
                                        <Separator
                                            orientation="horizontal"
                                            className="my-2"
                                        />
                                        <div className="flex justify-between items-center text-xs w-full">
                                            <p className="text-sm w-fit">
                                                <b className="mr-1">
                                                    Ngày tạo:
                                                </b>
                                                {dayjs(order.createdAt).format(
                                                    "DD/MM/YYYY"
                                                )}
                                            </p>
                                            <p className="text-sm w-fit">
                                                <b className="mr-1">Tổng:</b>
                                                {order.total.toLocaleString(
                                                    "vi-VN",
                                                    {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }
                                                )}
                                            </p>
                                        </div>
                                        <Separator
                                            orientation="horizontal"
                                            className="my-2"
                                        />
                                        <div className="flex gap-2 w-full">
                                            <Button
                                                className="flex-1"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/tracking?code=${order.code}`}
                                                >
                                                    Chi tiết
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>Không có đơn hàng nào</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
