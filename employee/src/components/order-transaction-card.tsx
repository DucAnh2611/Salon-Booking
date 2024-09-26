import { detailOrderTransaction } from "@/lib/redux/actions/order-detail.action";
import { orderDetailSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { useEffect } from "react";
import Failure from "./failure";
import Loading from "./loading";
import TransactionCard from "./transaction-card";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

export default function OrderTransactionCard() {
    const {
        base: { base },
        transaction: { transactions, isCalling, isFailure },
    } = useAppSelector(orderDetailSelector);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (base) {
            dispatch(detailOrderTransaction(base.id));
        }
    }, [base]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Giao dịch</CardTitle>
                <CardDescription>
                    Các giao dịch được tạo ra trong đơn hàng
                </CardDescription>
            </CardHeader>
            <Separator orientation="horizontal" />
            <CardContent className="w-full relative p-3">
                {isCalling && <Loading />}
                {isFailure && <Failure />}

                <div className="flex flex-col w-full gap-2">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="w-full">
                            <TransactionCard transaction={transaction} />
                        </div>
                    ))}
                </div>
                {!transactions.length && (
                    <div className="w-full">
                        <p className="text-sm py-5">Không có giao dịch nào</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
