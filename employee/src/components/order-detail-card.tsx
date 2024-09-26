import {
    ORDER_PAYMENT_TYPE,
    ORDER_STATUS,
    ORDER_TYPE,
} from "@/constants/order.constant";
import { EOrderPaymentType } from "@/enum/order.enum";
import { IOrderDetail } from "@/interface/api/order-detail.interface";
import { detailOrder } from "@/lib/redux/actions/order-detail.action";
import { orderDetailSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { formatMoney } from "@/utils/money";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { useEffect } from "react";
import Failure from "./failure";
import Loading from "./loading";
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

export default function OrderDetailCard() {
    const {
        base: { base, isCalling, isFailure, reload },
    } = useAppSelector(orderDetailSelector);
    const dispatch = useAppDispatch();

    const handleCopyCode = (orderCp: IOrderDetail) => () => {
        window.navigator.clipboard.writeText(orderCp.code);
        toast({
            title: "Sao chép thành công",
            description: "Đã sao chép thành công mã đơn hàng",
            duration: 500,
        });
    };

    useEffect(() => {
        if (base && reload) {
            dispatch(detailOrder(base.id));
        }
    }, [base, reload]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Thông tin đơn hàng</CardTitle>
                <CardDescription>
                    Thông tin giao hàng, số tiền, ...
                </CardDescription>
            </CardHeader>
            <CardContent className="w-full relative">
                {isCalling && <Loading />}
                {isFailure && <Failure />}
                {base && (
                    <div>
                        <Separator className="mb-5" orientation="horizontal" />
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
                                            {
                                                title: "Tên",
                                                value: base.name,
                                            },
                                            {
                                                title: "Địa chỉ",
                                                value: base.address,
                                            },
                                            {
                                                title: "Số điện thoại",
                                                value: base.phone,
                                            },
                                            {
                                                title: "Ghi chú",
                                                value: base.note || "Không",
                                            },
                                        ].map((item) =>
                                            item.value ? (
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
                                                    {base.code}
                                                </span>
                                                <Button
                                                    size="icon"
                                                    className="p-1 w-fit h-fit"
                                                    variant="ghost"
                                                    onClick={handleCopyCode(
                                                        base
                                                    )}
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
                                                {ORDER_TYPE[base.type]}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-7 w-full text-sm gap-3 items-start">
                                            <span className="font-medium whitespace-normal col-span-3">
                                                Phương thức thanh toán
                                            </span>
                                            <span className="whitespace-normal break-words col-span-4">
                                                {
                                                    ORDER_PAYMENT_TYPE[
                                                        base.paymentType
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
                                                        base.paid
                                                            ? "default"
                                                            : base.paymentType ===
                                                              EOrderPaymentType.CASH
                                                            ? "outline"
                                                            : "destructive"
                                                    }
                                                >
                                                    {base.paid
                                                        ? "Đã thanh toán"
                                                        : base.paymentType ===
                                                          EOrderPaymentType.CASH
                                                        ? "Tiền mặt"
                                                        : "Chưa thanh toán"}
                                                </Badge>
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-7 w-full text-sm gap-3 items-start">
                                            <span className="font-medium whitespace-normal col-span-3">
                                                Trạng thái đơn hàng
                                            </span>
                                            <span className="whitespace-normal break-words text-primary font-medium col-span-4">
                                                {ORDER_STATUS[base.status]}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-7 w-full text-sm gap-3 items-start">
                                            <span className="font-medium whitespace-normal col-span-3">
                                                Ngày đặt
                                            </span>
                                            <span className="whitespace-normal break-words col-span-4">
                                                {format(
                                                    base.createdAt,
                                                    "dd/MM/yyyy"
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Separator
                                className="my-5"
                                orientation="horizontal"
                            />
                            <div className="w-full flex gap-3">
                                <div className="flex-1"></div>
                                <Separator
                                    orientation="vertical"
                                    className="h-auto"
                                />
                                <div className="flex-1">
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
                                            {base.taxRate}%
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 text-sm gap-2">
                                        <span className="font-medium whitespace-nowrap col-span-1">
                                            Tổng thuế
                                        </span>
                                        <span className="col-span-1 w-full text-right">
                                            {formatMoney(base.tax)}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 text-sm gap-2">
                                        <span className="whitespace-nowrap font-medium col-span-1">
                                            Tổng đơn hàng
                                        </span>
                                        <span className="col-span-1 w-full text-right text-primary font-medium">
                                            {formatMoney(base.total)}
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
                                            {formatMoney(base.totalPaid)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
