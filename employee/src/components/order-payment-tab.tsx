import OrderRefundCard from "./order-refund-card";
import OrderTransactionCard from "./order-transaction-card";

export default function OrderPaymentTab() {
    return (
        <div className="grid grid-cols-2 gap-5">
            <div className="col-span-1">
                <OrderTransactionCard />
            </div>
            <div className="col-span-1">
                <OrderRefundCard />
            </div>
        </div>
    );
}
