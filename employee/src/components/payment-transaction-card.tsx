import { IPaymentTransactions } from "@/interface/api/transaction.interface";
import { formatMoney } from "@/utils/money";
import { format } from "date-fns";
import { Card } from "./ui/card";

interface IPaymentTransactionCardProps {
    paymentTransaction: IPaymentTransactions;
}

export default function PaymentTransactionCard({
    paymentTransaction,
}: IPaymentTransactionCardProps) {
    return (
        <Card className="p-2 flex flex-col gap-1">
            <div className="text-sm">
                <p className="font-medium">Mã giao dịch ngân hàng</p>
                <p className="text-muted-foreground whitespace-nowrap w-full">
                    {paymentTransaction.reference}
                </p>
            </div>
            <div className="text-sm">
                <p className="font-medium">Thời gian giao dịch</p>
                <p className="text-muted-foreground whitespace-nowrap w-full">
                    {format(
                        paymentTransaction.transactionDateTime,
                        "yyyy/MM/dd HH:mm:ss"
                    )}
                </p>
            </div>
            <div className="text-sm">
                <p className="font-medium">Mô tả</p>
                <p className="text-muted-foreground whitespace-normal w-full break-words">
                    {paymentTransaction.description}
                </p>
            </div>
            <div className="text-sm">
                <p className="font-medium">Số tiền</p>
                <p className="text-primary whitespace-nowrap w-full">
                    {formatMoney(paymentTransaction.amount)}
                </p>
            </div>
        </Card>
    );
}
