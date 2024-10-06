"use client";

import OrderTrackingDetail from "@/components/order-tracking-detail";
import OrderTrackingRefund from "@/components/order-tracking-refund";
import OrderTrackingState from "@/components/order-tracking-state";
import OrderTrackingTransaction from "@/components/order-tracking-transation";
import BankProvider from "@/context/bank.context";
import { EOrderPaymentType } from "@/enum/order.enum";
import useOrderTracking from "@/hook/useOrderTracking.hook";

export default function TrackingOrderPage() {
    const {
        order: { order: detail },
        state: { states },
        code,
    } = useOrderTracking();

    if (!detail) return <p>Không có đơn nào phù hợp với mã đơn: {code}</p>;

    document.title = "Chi tiết đơn hàng";

    return (
        <div className="w-full flex gap-5 relative">
            <div className="w-full h-fit flex-1">
                <OrderTrackingDetail />
            </div>
            <div className="grid grid-cols-1 gap-5 w-[400px] h-fit">
                {!!states.length && <OrderTrackingState />}
                {detail.paymentType === EOrderPaymentType.BANK && (
                    <BankProvider>
                        <OrderTrackingTransaction />
                    </BankProvider>
                )}
                {detail.paymentType === EOrderPaymentType.BANK && (
                    <OrderTrackingRefund />
                )}
            </div>
        </div>
    );
}
