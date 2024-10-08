import { ORDER_REFUND_REQUEST_STATUS } from "@/constant/order.constant";
import { EOrderRefundRequestStatus } from "@/enum/order.enum";
import useOrderTracking from "@/hook/useOrderTracking.hook";
import { IRefundOrder } from "@/interface/refund.interface";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import DialogCancelRefund from "./dialog-cancel-refund";
import DialogReceiveRefund from "./dialog-receive-refund";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

const colorSchema: Record<EOrderRefundRequestStatus, string> = {
    [EOrderRefundRequestStatus.PENDING]: "hsl(var(--primary))",
    [EOrderRefundRequestStatus.APPROVED]: "#3b82f6",
    [EOrderRefundRequestStatus.DECLINE]: "hsl(var(--destructive))",
    [EOrderRefundRequestStatus.EXPIRED]: "#a855f7",
    [EOrderRefundRequestStatus.RECEIVED]: "#4ade80",
    [EOrderRefundRequestStatus.CANCELLED]: "hsl(var(--destructive))",
};

interface IRefundRequestCardProps {
    refund: IRefundOrder;
}

export default function RefundRequestCard({ refund }: IRefundRequestCardProps) {
    const {
        order: { order },
        reload,
    } = useOrderTracking();
    const [open, SetOpen] = useState<boolean>(false);

    const toggleDetail = () => {
        SetOpen((o) => !o);
    };

    const onSuccessCancel = () => {
        reload("refund");
        reload("transaction");
        reload("order");
    };

    const onSuccessReceive = () => {
        reload("refund");
        reload("transaction");
        reload("order");
    };

    return (
        <Card
            style={{ borderColor: colorSchema[refund.status] }}
            className={cn("overflow-hidden", `border`)}
        >
            <CardHeader className="p-2 bg-muted group">
                <div className="w-full flex justify-between items-center text-sm">
                    <span className="font-medium">
                        {format(refund.createdAt, "yyyy/MM/dd HH:mm")}
                    </span>
                    <span
                        style={{ color: colorSchema[refund.status] }}
                        className={cn("font-medium")}
                    >
                        {ORDER_REFUND_REQUEST_STATUS[refund.status]}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="p-2 group">
                <div
                    className={cn(
                        "w-full overflow-hidden flex-col gap-3",
                        open ? "flex" : "hidden"
                    )}
                >
                    {refund.orderId && (
                        <div className="w-full text-sm flex flex-col gap-1">
                            <span className="font-medium">Đơn hàng:</span>
                            <span className="uppercase text-muted-foreground">
                                {order?.code}
                            </span>
                        </div>
                    )}

                    {refund.transaction && (
                        <div className="w-full text-sm flex flex-col gap-1">
                            <span className="font-medium">Giao dịch:</span>
                            <span className="uppercase text-muted-foreground">
                                {refund.transaction.paymentId}
                            </span>
                        </div>
                    )}

                    <div className="w-full">
                        <span className="font-medium">Ngân hàng:</span>
                        <div className="flex gap-3 w-full mt-2 items-start">
                            <Image
                                src={refund.bank.logo}
                                alt="refund_bank"
                                width={150}
                                height={150}
                                className="w-10 h-10 rounded-full overflow-hidden object-contain bg-white"
                            />
                            <div className="flex-1 h-fit">
                                <p className="text-primary font-medium">
                                    {refund.bank.code}
                                </p>

                                <p className="">{refund.bank.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 text-sm  w-full">
                        <span className="font-medium">Số tài khoản:</span>

                        <span className="">{refund.accountBankNumber}</span>
                    </div>

                    <div className="flex gap-2 text-sm  w-full">
                        <span className="font-medium">Tên tài khoản:</span>

                        <span className="">{refund.accountBankName}</span>
                    </div>

                    <div className="flex gap-2 text-sm  w-full">
                        <span className="font-medium">Ghi chú:</span>

                        <span className="">
                            {refund.description || "Không"}
                        </span>
                    </div>
                </div>
                <Separator orientation="horizontal" className="my-1" />
                <div className="flex justify-end w-full my-2">
                    <div className="flex gap-2 text-sm  w-full">
                        <span className="font-medium">Hết hạn:</span>

                        <span className="text-muted-foreground italic">
                            {format(refund.expiredAt, "yyyy/MM/dd HH:mm:ss")}
                        </span>
                    </div>

                    <div className="flex w-fit gap-2 text-sm">
                        <span className="font-medium">Tổng:</span>
                        <span className="font-medium">
                            {formatMoney(refund.amount)}
                        </span>
                    </div>
                </div>

                {refund.status === EOrderRefundRequestStatus.APPROVED &&
                    order && (
                        <div className="w-full">
                            <DialogReceiveRefund
                                trigger={
                                    <Button
                                        className="w-full bg-blue-500 text-blue-500 border-blue-500 bg-opacity-15 hover:text-blue-500 hover:bg-blue-500 hover:bg-opacity-25"
                                        variant="ghost"
                                    >
                                        Đã nhận
                                    </Button>
                                }
                                orderId={order.id}
                                onSuccess={onSuccessReceive}
                                requestId={refund.id}
                            />
                        </div>
                    )}

                {refund.status === EOrderRefundRequestStatus.PENDING &&
                    order && (
                        <div className="w-full">
                            <DialogCancelRefund
                                trigger={
                                    <Button
                                        className="w-full bg-red-500 text-red-500 border-red-500 bg-opacity-15 hover:text-red-500 hover:bg-red-500 hover:bg-opacity-25"
                                        variant="ghost"
                                    >
                                        Hủy yêu cầu
                                    </Button>
                                }
                                orderId={order.id}
                                onSuccess={onSuccessCancel}
                                requestId={refund.id}
                            />
                        </div>
                    )}

                <Separator orientation="horizontal" className="my-1" />
                <div>
                    <Button
                        variant="ghost"
                        className="w-full gap-2 justify-center text-muted-foreground text-xs"
                        onClick={toggleDetail}
                    >
                        {!open ? (
                            <>
                                <ChevronsDown size={15} />
                                Xem thêm
                            </>
                        ) : (
                            <>
                                <ChevronsUp size={15} />
                                Thu gọn
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
