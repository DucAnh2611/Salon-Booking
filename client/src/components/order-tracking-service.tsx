"use client";

import useOrderTracking from "@/hook/useOrderTracking.hook";
import OrderDetailServiceItem from "./order-detail-service-items";

interface IOrderTrackingserviceProps {}

export default function OrderTrackingService({}: IOrderTrackingserviceProps) {
    const {
        service: { services, isLoading, isError },
    } = useOrderTracking();

    return (
        <div className="w-full relative">
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error</p>}
            <div className="space-y-2">
                {services.map((item) => (
                    <div key={item.id}>
                        <OrderDetailServiceItem serviceItem={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}
