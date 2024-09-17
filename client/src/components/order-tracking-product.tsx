"use client";

import useOrderTracking from "@/hook/useOrderTracking.hook";

interface IOrderTrackingProductProps {}

export default function OrderTrackingProduct({}: IOrderTrackingProductProps) {
    const {
        product: { products, isLoading, isError },
    } = useOrderTracking();

    return (
        <div className="w-full relative">
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error</p>}
            <div>
                {products.map((item) => (
                    <div key={item.id}>
                        <p>{item.productId}</p>
                        <p>{item.productSnapshot.name}</p>
                        <p>{item.productTypeId}</p>
                        <p>{item.quantity}</p>
                        <p>{item.unitPrice}</p>
                        <p>{item.totalPrice}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
