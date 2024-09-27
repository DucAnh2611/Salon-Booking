import { ORDER_PAYMENT_STATUS } from "@/constant/order.constant";
import {
    EOrderPaymentStatus,
    EOrderPaymentType,
    EOrderStatus,
} from "@/enum/order.enum";
import useOrderTracking from "@/hook/useOrderTracking.hook";
import { ITransactionOrder } from "@/interface/transaction.interface";
import { getTimeDifference } from "@/lib/date";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DialogCancelTransaction from "./dialog-cancel-transaction";
import DialogCreateRefund from "./dialog-create-refund";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

const colorSchema: Record<EOrderPaymentStatus, string> = {
    [EOrderPaymentStatus.PENDING]: "hsl(var(--primary))",
    [EOrderPaymentStatus.PAID]: "#4ade80",
    [EOrderPaymentStatus.CANCELLED]: "hsl(var(--destructive))",
};

interface ITransactionCartProps {
    transaction: ITransactionOrder;
}

export default function TransactionCard({
    transaction,
}: ITransactionCartProps) {
    const {
        order: { order },
        reload,
    } = useOrderTracking();
    const router = useRouter();

    const [open, SetOpen] = useState<boolean>(false);
    const [timeRemain, SetTimeRemain] = useState<{
        minutes: number;
        seconds: number;
    }>(getTimeDifference(new Date(), new Date(transaction.expireAt)));

    const toggleDetail = () => {
        SetOpen((o) => !o);
    };

    const onSuccessCancel = () => {
        reload("order");
        reload("transaction");
    };

    const onSuccessCreatRefundRequet = () => {
        reload("transaction");
    };

    const getAmountRefund = () => {
        if (order) {
            if (order.status === EOrderStatus.CANCELLED) {
                return transaction.paidAmount;
            } else {
                if (transaction.status === EOrderPaymentStatus.PAID) {
                    return transaction.paidAmount - transaction.orderAmount;
                } else {
                    return transaction.paidAmount;
                }
            }
        }
        return 0;
    };

    useEffect(() => {
        if (Date.now() - new Date(transaction.expireAt).getTime() < 0) {
            const interval = setInterval(() => {
                SetTimeRemain(
                    getTimeDifference(
                        new Date(),
                        new Date(transaction.expireAt)
                    )
                );
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, []);

    if (!order) return <></>;

    return (
        <Card
            style={{
                borderColor: colorSchema[transaction.status],
            }}
            className={cn("overflow-hidden", `border`)}
        >
            <CardHeader className="p-2 bg-muted group">
                <div className="w-full flex justify-between items-center text-sm">
                    {transaction.status === EOrderPaymentStatus.PENDING ? (
                        <span className="font-medium">
                            {timeRemain.minutes < 10
                                ? `0${timeRemain.minutes}`
                                : timeRemain.minutes}
                            :
                            {timeRemain.seconds < 10
                                ? `0${timeRemain.seconds}`
                                : timeRemain.seconds}
                        </span>
                    ) : (
                        <span className="font-medium">
                            {format(
                                transaction.createdAt,
                                "yyyy/MM/dd HH:mm:ss"
                            )}
                        </span>
                    )}
                    <span
                        style={{ color: colorSchema[transaction.status] }}
                        className={cn("font-medium")}
                    >
                        {ORDER_PAYMENT_STATUS[transaction.status]}
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
                    <div className="w-full text-sm flex flex-col gap-1">
                        <span className="font-medium">Mã thanh toán</span>
                        <span className="uppercase text-muted-foreground">
                            {transaction.paymentId}
                        </span>
                    </div>
                    <div className="w-full text-sm flex flex-col gap-1">
                        <span className="font-medium">Mô tả</span>
                        <span className="text-muted-foreground">
                            {transaction.description}
                        </span>
                    </div>
                </div>
                <Separator orientation="horizontal" className="my-1" />
                <div className="flex justify-between w-full">
                    <div className="flex w-fit gap-2 text-sm">
                        <span className="font-medium whitespace-nowrap">
                            Đã thanh toán:
                        </span>
                        <span className="font-medium">
                            {formatMoney(transaction.paidAmount)}
                        </span>
                    </div>
                    <div className="flex w-fit gap-2 text-sm">
                        <span className="font-medium">Tổng:</span>
                        <span className="font-medium">
                            {formatMoney(transaction.orderAmount)}
                        </span>
                    </div>
                </div>

                {transaction.paidAmount > 0 && (
                    <div>
                        <Separator orientation="horizontal" className="my-1" />
                        <div className="w-full text-sm flex flex-row gap-1">
                            <span className="font-medium text-primary">
                                Tiền hoàn lại:
                            </span>
                            <span className="font-medium ">
                                {formatMoney(getAmountRefund())}
                            </span>
                        </div>
                        {open ? (
                            transaction.createRefund ? (
                                <DialogCreateRefund
                                    trigger={
                                        <Button
                                            variant="default"
                                            className="w-full mt-2"
                                            size="sm"
                                        >
                                            Yêu cầu hoàn tiền
                                        </Button>
                                    }
                                    order={order}
                                    amount={getAmountRefund()}
                                    transaction={transaction}
                                    onSuccess={onSuccessCreatRefundRequet}
                                />
                            ) : (
                                transaction.status !==
                                    EOrderPaymentStatus.PAID && (
                                    <div className="w-full text-sm flex flex-row gap-1">
                                        <span className="font-medium italic text-xs text-muted-foreground">
                                            Yêu cầu hoàn tiền đã được ghi nhận
                                        </span>
                                    </div>
                                )
                            )
                        ) : (
                            <></>
                        )}
                    </div>
                )}

                {transaction.status == EOrderPaymentStatus.PENDING &&
                    order &&
                    order.paymentType === EOrderPaymentType.BANK && (
                        <div className="flex gap-2 w-full">
                            <DialogCancelTransaction
                                orderId={order.id}
                                transactionId={transaction.id}
                                onSuccess={onSuccessCancel}
                                trigger={
                                    <Button
                                        variant="default"
                                        className="w-full mt-2 bg-red-500 text-red-500 bg-opacity-15 hover:bg-red-500 hover:bg-opacity-20"
                                        size="sm"
                                    >
                                        Hủy giao dịch
                                    </Button>
                                }
                            />
                            <Button
                                variant="default"
                                className="w-full mt-2 bg-yellow-500 text-yellow-500 bg-opacity-15 hover:bg-yellow-500 hover:bg-opacity-20"
                                size="sm"
                                asChild
                            >
                                <Link
                                    href={transaction.paymentUrl}
                                    target="_blank"
                                >
                                    Tiếp tục thanh toán
                                </Link>
                            </Button>
                        </div>
                    )}

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
