"use client";

import OrderTrackingProvider from "@/context/order-tracking.context";
import withAuth from "@/hoc/withAuth";
import { ILayoutProps } from "@/interface/layout.interface";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

interface ITrackingLayoutProps extends ILayoutProps {
    tracking: ReactNode;
}

function TrackingLayout({ children, tracking }: ITrackingLayoutProps) {
    const search = useSearchParams();

    const code = search.get("code");

    document.title = "Tra cứu đơn hàng";

    return (
        <div className="w-full h-fit py-10 box-border">
            <div className="container px-4 w-full box-border h-fit relative">
                <OrderTrackingProvider>
                    <div className="w-full bg-background mb-5">{children}</div>
                    {!!code && <div className="w-full">{tracking}</div>}
                </OrderTrackingProvider>
            </div>
        </div>
    );
}
export default withAuth(TrackingLayout);
