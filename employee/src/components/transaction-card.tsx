import { ORDER_PAYMENT_STATUS } from "@/constants/order.constant";
import { EOrderPaymentStatus } from "@/enum/order.enum";
import { IOrderDetailTransaction } from "@/interface/api/order-detail.interface";
import { cn } from "@/lib";
import { orderDetailSelector } from "@/lib/redux/selector";
import { useAppSelector } from "@/lib/redux/store";
import { getTimeDifference } from "@/utils/date.utils";
import { formatMoney } from "@/utils/money";
import { format } from "date-fns";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { useEffect, useState } from "react";
import PaymentTransactionCard from "./payment-transaction-card";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

const colorSchema: Record<EOrderPaymentStatus, string> = {
    [EOrderPaymentStatus.PENDING]: "hsl(var(--primary))",
    [EOrderPaymentStatus.PAID]: "#4ade80",
    [EOrderPaymentStatus.CANCELLED]: "hsl(var(--destructive))",
};

interface ITransactionCartProps {
    transaction: IOrderDetailTransaction;
}

export default function TransactionCard({
    transaction,
}: ITransactionCartProps) {
    const {
        base: { base },
    } = useAppSelector(orderDetailSelector);

    const [open, SetOpen] = useState<boolean>(false);
    const [timeRemain, SetTimeRemain] = useState<{
        minutes: number;
        seconds: number;
    }>(getTimeDifference(new Date(), new Date(transaction.expireAt)));

    const toggleDetail = () => {
        SetOpen((o) => !o);
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

    if (!base) return <></>;

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
                            {format(transaction.createdAt, "yyyy/MM/dd HH:mm")}
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

                <div
                    className={cn(
                        "w-full overflow-hidden flex-col mt-3",
                        open ? "flex" : "hidden"
                    )}
                >
                    <Separator orientation="horizontal" className="my-1" />

                    <div>
                        <p className="text-lg font-medium whitespace-nowrap">
                            Lịch sử giao dịch
                        </p>
                        <div className="flex flex-col gap-1 max-h-[400px] overflow-auto mt-1">
                            {transaction.paymentTransactions.length ? (
                                transaction.paymentTransactions.map(
                                    (pTransaction) => (
                                        <div key={pTransaction.reference}>
                                            <PaymentTransactionCard
                                                paymentTransaction={
                                                    pTransaction
                                                }
                                            />
                                        </div>
                                    )
                                )
                            ) : (
                                <p className="text-center w-full my-4 mt-6 text-xs">
                                    Không có giao dịch nào
                                </p>
                            )}
                        </div>
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

                {transaction.paidAmount - transaction.orderAmount > 0 && (
                    <div>
                        <Separator orientation="horizontal" className="my-1" />
                        <div className="w-full text-sm flex flex-row gap-1">
                            <span className="font-medium text-primary">
                                Tiền hoàn lại:
                            </span>
                            <span className="font-medium ">
                                {formatMoney(
                                    transaction.paidAmount -
                                        transaction.orderAmount
                                )}
                            </span>
                        </div>
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
