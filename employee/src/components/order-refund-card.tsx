import { detailOrderRefund } from "@/lib/redux/actions/order-detail.action";
import { orderDetailSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { useEffect } from "react";
import Failure from "./failure";
import Loading from "./loading";
import RefundRequestCard from "./refund-request-card";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

export default function OrderRefundCard() {
    const {
        base: { base },
        refund: { refunds, isCalling, isFailure },
    } = useAppSelector(orderDetailSelector);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (base) {
            dispatch(detailOrderRefund(base.id));
        }
    }, [base]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Yêu cầu hoàn tiền</CardTitle>
                <CardDescription>
                    Các yêu cầu được tạo ra từ các giao dịch dư tiền, hoàn đơn,
                    đã hủy đơn nhưng đã thanh toán 1 phần.
                </CardDescription>
            </CardHeader>
            <Separator orientation="horizontal" />
            <CardContent className="w-full relative p-3">
                {isCalling && <Loading />}
                {isFailure && <Failure />}
                {!!refunds.length && (
                    <div className="flex flex-col w-full gap-2">
                        {refunds.map((refund) => (
                            <div key={refund.id} className="w-full">
                                <RefundRequestCard refund={refund} />
                            </div>
                        ))}
                    </div>
                )}
                {!refunds.length && (
                    <div className="w-full">
                        <p className="text-sm py-5">Không có yêu cầu nào</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
