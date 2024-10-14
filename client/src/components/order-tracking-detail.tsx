"use client";

import {
    ORDER_PAYMENT_TYPE,
    ORDER_STATUS,
    ORDER_TYPE,
} from "@/constant/order.constant";
import { EOrderPaymentType, EOrderStatus, EOrderType } from "@/enum/order.enum";
import { ESocketEvent, ESocketMessage } from "@/enum/socket.enum";
import useOrderTracking from "@/hook/useOrderTracking.hook";
import useSocket from "@/hook/useSocket.hook";
import { IOrderDetail } from "@/interface/order.interface";
import { expiredOrderService } from "@/lib/actions/order.action";
import { getPaymentLinkProduct } from "@/lib/actions/transaction.action";
import { getTimeDifference } from "@/lib/date";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import DialogCancelOrder from "./dialog-cancel-order";
import DialogConfirmOrder from "./dialog-confirm-order";
import DialogReceiveOrder from "./dialog-receive-order";
import DialogReturnOrder from "./dialog-return-order";
import OrderTrackingProduct from "./order-tracking-product";
import OrderTrackingService from "./order-tracking-service";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";

interface IOrderTrackingDetailProps {}

export default function OrderTrackingDetail({}: IOrderTrackingDetailProps) {
    const router = useRouter();
    const {
        order: { order: order },
        reload,
    } = useOrderTracking();
    const [timeLeft, SetTimeLeft] = useState<string>("00:00");
    const [isExpired, SetIsExpired] = useState<boolean>(false);

    const { socket, isConnected } = useSocket();

    const handleCopyCode = (orderCp: IOrderDetail) => () => {
        window.navigator.clipboard.writeText(orderCp.code);
        toast({
            title: "Sao chép thành công",
            description: "Đã sao chép thành công mã đơn hàng",
            duration: 500,
        });
    };

    const payOrder = (order: IOrderDetail) => async () => {
        const { response } = await getPaymentLinkProduct(order.id);

        if (response) {
            router.push(response.result.paymentUrl);
        } else {
            toast({
                title: "Thất bại",
                description:
                    "Lấy link thanh toán thất bại. Vui lòng thử lại sau",
                variant: "destructive",
            });
        }
    };

    const expiredOrder = async (id: string) => {
        const { response } = await expiredOrderService(id);

        if (response) {
            reload("order");
            reload("state");
            reload("transaction");
            reload("refund");
        }
    };

    const onSuccessCancel = () => {
        reload("order");
        reload("state");
    };

    const onSuccessReceive = () => {
        reload("order");
        reload("state");
    };

    const onSuccessReturn = () => {
        reload("order");
        reload("state");
    };

    const onSuccessConfirm = () => {
        reload("order");
        reload("state");
    };

    useEffect(() => {
        if (order) {
            if (
                order.confirmExpired &&
                new Date(order.confirmExpired) >= new Date()
            ) {
                const timeCountInterval = setInterval(() => {
                    const { minutes, seconds } = getTimeDifference(
                        new Date(),
                        order.confirmExpired
                            ? new Date(order.confirmExpired)
                            : new Date()
                    );

                    SetTimeLeft(
                        `${minutes > 9 ? minutes : `0${minutes}`}:${
                            seconds > 9 ? seconds : `0${seconds}`
                        }`
                    );
                    if (minutes <= 0 && seconds <= 0) {
                        SetIsExpired(true);
                        expiredOrder(order.id);
                    }
                }, 1000);

                return () => {
                    clearInterval(timeCountInterval);
                };
            } else if (!order.confirmExpired) {
                SetIsExpired(false);
            } else {
                SetIsExpired(true);
            }
        }
    }, [order]);

    useEffect(() => {
        if (!socket || !isConnected) return;

        if (socket) {
            console.log(socket);
            if (order) {
                socket.emit(ESocketMessage.CLIENT_TRACKING_ORDER, {
                    orderId: order.id,
                });
            }

            socket.on(ESocketEvent.EMPLOYEE_ORDER_UPDATED, () => {
                reload("order");
                reload("state");
                reload("transaction");
                reload("refund");
            });

            return () => {
                if (order) {
                    socket.emit(ESocketMessage.CLIENT_UNTRACK_ORDER, {
                        orderId: order.id,
                    });
                }
                socket.off(ESocketEvent.EMPLOYEE_ORDER_UPDATED);
            };
        }
    }, [socket, isConnected, order]);

    if (!order) return <Fragment></Fragment>;

    return (
        <div className="w-full">
            {order.confirmExpired && !isExpired && order.confirmable && (
                <div className="box-border flex items-center gap-5 px-3 py-2 rounded-md border mb-1">
                    <p className="flex-1 break-words whitespace-normal text-sm font-medium">
                        Vui lòng xác nhận đơn hàng trước
                        <span className="text-primary ml-2">
                            {format(
                                order.confirmExpired,
                                "yyyy/MM/dd HH:mm:ss"
                            )}
                        </span>
                    </p>
                    <div>
                        <DialogConfirmOrder
                            onSuccess={onSuccessConfirm}
                            orderId={order.id}
                            trigger={
                                <Button
                                    className=""
                                    variant="default"
                                    disabled={!order.confirmable}
                                >
                                    Xác nhận {timeLeft}
                                </Button>
                            }
                        />
                    </div>
                </div>
            )}
            {order.confirmExpired &&
                isExpired &&
                order.status === EOrderStatus.CANCELLED && (
                    <div className="box-border flex bg-destructive items-center gap-5 px-3 py-2 rounded-md border mb-1">
                        <p className="flex-1 break-words whitespace-normal text-sm font-medium">
                            {`Đơn hàng đã hết hạn lúc ${format(
                                order.confirmExpired,
                                "yyyy/MM/dd HH:mm:ss"
                            )}, đơn đã tự động bị hủy. Các yêu cầu giao dịch cũng bị hủy, nếu bạn đã chuyển 1 phần tiền, hãy gửi yêu cầu hoàn tiền.`}
                        </p>
                    </div>
                )}
            {order.createPayment && !isExpired && (
                <div className="bg-primary box-border flex items-center gap-5 px-3 py-2 rounded-t-md">
                    <p className="flex-1 break-words whitespace-normal text-background text-sm font-medium text-black">
                        Đơn hàng này hiện chưa được thanh toán, vui lòng thanh
                        toán để hoàn tất việc đặt hàng.
                        <br />
                        {order.confirmExpired &&
                            `Lưu ý: cần xác nhận đơn hàng trong ${timeLeft}`}
                    </p>
                    <Button
                        variant="outline"
                        className="bg-muted"
                        onClick={payOrder(order)}
                    >
                        Thanh toán
                    </Button>
                </div>
            )}
            <Card
                className={cn(
                    "w-full",
                    order.paymentType === EOrderPaymentType.BANK && !order.paid
                        ? "rounded-t-none"
                        : ""
                )}
            >
                <CardHeader>
                    <CardTitle>Chi tiết đơn hàng</CardTitle>
                    <CardDescription>
                        Thông tin về đơn hàng của bạn, nếu đơn hàng có vấn đề
                        bạn có thể{" "}
                        <b className="text-primary">hủy và yêu cầu hoàn tiền</b>
                        . Trong trường hợp phương thức thanh toán là{" "}
                        <b className="text-primary">chuyển khoản</b> và bạn
                        chuyển khoản <b className="text-primary">dư tiền</b>,
                        bạn có thể tạo yêu cầu hoàn tiền tới ngân hàng bạn mong
                        muốn.
                    </CardDescription>
                </CardHeader>
                <Separator className="mb-5" orientation="horizontal" />
                <CardContent>
                    <div className="w-full">
                        <div className="flex w-full gap-3">
                            <div className="flex-1">
                                <span className="text-base font-medium">
                                    Thông tin người nhận
                                </span>
                                <Separator
                                    className="my-2"
                                    orientation="horizontal"
                                />
                                <div className="grid grid-cols-1 w-full gap-4">
                                    {[
                                        { title: "Tên", value: order.name },
                                        {
                                            title: "Địa chỉ",
                                            value: order.address,
                                        },
                                        {
                                            title: "Số điện thoại",
                                            value: order.phone,
                                        },
                                        {
                                            title: "Ghi chú",
                                            value: order.note || "Không",
                                        },
                                    ].map((item) =>
                                        !!item.value ? (
                                            <div
                                                className="grid grid-cols-7 w-full text-sm gap-3 items-start"
                                                key={item.title}
                                            >
                                                <span className="font-medium whitespace-normal col-span-2 place-items-start">
                                                    {item.title}
                                                </span>
                                                <span className="whitespace-normal break-words col-span-5 text-muted-foreground">
                                                    {item.value}
                                                </span>
                                            </div>
                                        ) : (
                                            <></>
                                        )
                                    )}
                                </div>
                            </div>
                            <Separator
                                orientation="vertical"
                                className="h-auto"
                            />
                            <div className="flex-1">
                                <span className="text-base font-medium">
                                    Thông tin đơn hàng
                                </span>
                                <Separator
                                    className="my-2"
                                    orientation="horizontal"
                                />
                                <div className="grid grid-cols-1 w-full gap-4">
                                    <div className="grid grid-cols-7 w-full text-sm gap-3 items-start">
                                        <span className="font-medium whitespace-normal col-span-3">
                                            Mã đơn hàng
                                        </span>
                                        <div className="flex gap-1 items-center col-span-4">
                                            <span className="">
                                                {order.code}
                                            </span>
                                            <Button
                                                size="icon"
                                                className="p-1 w-fit h-fit"
                                                variant="ghost"
                                                onClick={handleCopyCode(order)}
                                            >
                                                <Copy size={10} />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 w-full text-sm gap-3 items-start">
                                        <span className="font-medium whitespace-normal col-span-3">
                                            Loại đơn
                                        </span>
                                        <span className="whitespace-normal break-words col-span-4">
                                            {ORDER_TYPE[order.type]}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-7 w-full text-sm gap-3 items-start">
                                        <span className="font-medium whitespace-normal col-span-3">
                                            Phương thức thanh toán
                                        </span>
                                        <span className="whitespace-normal break-words col-span-4">
                                            {
                                                ORDER_PAYMENT_TYPE[
                                                    order.paymentType
                                                ]
                                            }
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-7 w-full text-sm gap-3 items-start">
                                        <span className="font-medium whitespace-normal col-span-3">
                                            Tình trạng thanh toán
                                        </span>
                                        <span className="whitespace-normal break-words col-span-4">
                                            <Badge
                                                variant={
                                                    order.paid
                                                        ? "default"
                                                        : order.paymentType ===
                                                          EOrderPaymentType.CASH
                                                        ? "outline"
                                                        : "destructive"
                                                }
                                            >
                                                {order.paid
                                                    ? "Đã thanh toán"
                                                    : order.paymentType ===
                                                      EOrderPaymentType.CASH
                                                    ? "Thanh toán khi hoàn thành"
                                                    : "Chưa thanh toán"}
                                            </Badge>
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-7 w-full text-sm gap-3 items-start">
                                        <span className="font-medium whitespace-normal col-span-3">
                                            Trạng thái đơn hàng
                                        </span>
                                        <span className="whitespace-normal break-words text-primary font-medium col-span-4">
                                            {ORDER_STATUS[order.status]}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-7 w-full text-sm gap-3 items-start">
                                        <span className="font-medium whitespace-normal col-span-3">
                                            Ngày đặt
                                        </span>
                                        <span className="whitespace-normal break-words col-span-4">
                                            {format(
                                                order.createdAt,
                                                "dd/MM/yyyy hh:mm aaa"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Separator className="my-5" orientation="horizontal" />
                        <div className="w-full">
                            <span className="text-base font-medium">
                                Danh sách vật phẩm
                            </span>
                            <Separator
                                className="my-2"
                                orientation="horizontal"
                            />
                            <div className="w-full">
                                {order.type === EOrderType.SERVICE && (
                                    <OrderTrackingService />
                                )}
                                {order.type === EOrderType.PRODUCT && (
                                    <OrderTrackingProduct />
                                )}
                            </div>
                        </div>
                        <Separator className="my-5" orientation="horizontal" />
                        <div className="w-full flex items-start justify-end">
                            <div className="w-1/2">
                                <span className="text-base font-medium w-1/2 text-left">
                                    Giá trị đơn hàng
                                </span>
                                <Separator
                                    className="my-2"
                                    orientation="horizontal"
                                />
                                <div className="grid grid-cols-2 text-sm gap-2 mt-3">
                                    <span className="font-medium whitespace-nowrap col-span-1">
                                        Thuế
                                    </span>
                                    <span className="col-span-1 w-full text-right">
                                        {order.taxRate}%
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 text-sm gap-2">
                                    <span className="font-medium whitespace-nowrap col-span-1">
                                        Tổng thuế
                                    </span>
                                    <span className="col-span-1 w-full text-right">
                                        {formatMoney(order.tax)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 text-sm gap-2">
                                    <span className="whitespace-nowrap font-medium col-span-1">
                                        Tổng đơn hàng
                                    </span>
                                    <span className="col-span-1 w-full text-right text-primary font-medium">
                                        {formatMoney(order.total)}
                                    </span>
                                </div>
                                <Separator
                                    className="my-2"
                                    orientation="horizontal"
                                />
                                <div className="grid grid-cols-2 text-sm gap-2">
                                    <span className="whitespace-nowrap font-medium col-span-1">
                                        Đã thanh toán
                                    </span>
                                    <span className="col-span-1 w-full text-right font-medium">
                                        {formatMoney(order.totalPaid)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="w-full py-3">
                <div className="w-full grid grid-cols-2 gap-2">
                    {order.cancelable && (
                        <DialogCancelOrder
                            onSuccess={onSuccessCancel}
                            trigger={
                                <Button className="w-full" variant="outline">
                                    Hủy đơn
                                </Button>
                            }
                            orderId={order.id}
                        />
                    )}
                    {order.returnable && (
                        <DialogReturnOrder
                            onSuccess={onSuccessReturn}
                            orderId={order.id}
                            trigger={
                                <Button className="w-full" variant="outline">
                                    Hoàn đơn
                                </Button>
                            }
                        />
                    )}
                    {order.confirmable &&
                        order.confirmExpired &&
                        !isExpired && (
                            <DialogConfirmOrder
                                onSuccess={onSuccessConfirm}
                                orderId={order.id}
                                trigger={
                                    <Button
                                        className="w-full"
                                        variant="default"
                                        disabled={!order.confirmable}
                                    >
                                        Xác nhận đơn hàng
                                    </Button>
                                }
                            />
                        )}
                    {order.receivable && (
                        <DialogReceiveOrder
                            onSuccess={onSuccessReceive}
                            orderId={order.id}
                            trigger={
                                <Button className="w-full" variant="default">
                                    Đã nhận được hàng
                                </Button>
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
