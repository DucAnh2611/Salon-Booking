import OrderDetailCard from "./order-detail-card";
import OrderItemCard from "./order-item-card";

export default function OrderDetailTab() {
    return (
        <div className="w-full grid grid-cols-1 gap-5">
            <OrderDetailCard />
            <OrderItemCard />
        </div>
    );
}
