import { EOrderType } from "@/enum/order.enum";
import { orderDetailSelector } from "@/lib/redux/selector";
import { useAppSelector } from "@/lib/redux/store";
import OrderDetailProductCard from "./order-detail-product-card";
import OrderDetailServiceCard from "./order-detail-service-card";

export default function OrderItemCard() {
    const {
        base: { base },
    } = useAppSelector(orderDetailSelector);

    if (!base) {
        return <></>;
    }

    if (base.type === EOrderType.PRODUCT) return <OrderDetailProductCard />;

    if (base.type === EOrderType.SERVICE) return <OrderDetailServiceCard />;

    return <></>;
}
