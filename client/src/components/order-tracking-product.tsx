"use client";

import useOrderTracking from "@/hook/useOrderTracking.hook";
import OrderDetailProductItem from "./order-detail-product-item";

interface IOrderTrackingProductProps {}

export default function OrderTrackingProduct({}: IOrderTrackingProductProps) {
    const {
        product: { products, isLoading, isError },
    } = useOrderTracking();

    return (
        <div className="w-full relative">
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error</p>}
            <div className="space-y-2">
                {products.map((item) => (
                    <div key={item.id}>
                        <OrderDetailProductItem productItem={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}
