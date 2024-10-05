"use client";

import OrderListProviver from "@/context/order-list-context.context";
import withAuth from "@/hoc/withAuth";
import { ILayoutProps } from "@/interface/layout.interface";
import { useSearchParams } from "next/navigation";

interface IOrderLayoutProps extends ILayoutProps {}

function OrderLayout({ children }: IOrderLayoutProps) {
    const search = useSearchParams();

    const previewQuery = search.get("preview");

    document.title = "Danh sách đơn hàng";

    return (
        <div className="w-full h-fit py-10 box-border">
            <div className="container px-4 gap-5 flex w-full box-border h-fit">
                <OrderListProviver>{children}</OrderListProviver>
            </div>
        </div>
    );
}

export default withAuth(OrderLayout);
