import {
    ORDER_PAYMENT_TYPE,
    ORDER_STATUS,
    ORDER_TYPE,
} from "@/constant/order.constant";
import { EOrderPaymentType, EOrderType } from "@/enum/order.enum";
import useOrderTracking from "@/hook/useOrderTracking.hook";
import { IOrderDetail } from "@/interface/order.interface";
import { getPaymentLinkProduct } from "@/lib/actions/transaction.action";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import OrderTrackingProduct from "./order-tracking-product";
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
    } = useOrderTracking();

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
            });
        }
    };

    if (!order) return <></>;

    return (
        <div className="w-full">
            {order.paymentType === EOrderPaymentType.BANK && !order.paid && (
                <div className="bg-primary box-border flex items-center gap-5 px-3 py-2 rounded-t-md">
                    <p className="flex-1 break-words whitespace-normal text-background text-sm font-medium text-black">
                        Đơn hàng này hiện chưa được thanh toán, vui lòng thanh
                        toán để hoàn tất việc đặt hàng.
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
                                    ].map((item) => (
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
                                    ))}
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
                                                    ? "Thanh toán khi nhận hàng"
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
                                Danh sách đơn hàng
                            </span>
                            <Separator
                                className="my-2"
                                orientation="horizontal"
                            />
                            <div className="w-full">
                                {order.type === EOrderType.SERVICE && <p></p>}
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
        </div>
    );
}
