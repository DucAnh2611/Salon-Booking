"use client";

import CartProductContactProvider from "@/context/cart-product-contact.context";
import CartServiceContactProvider from "@/context/cart-service-contact.context";
import ProvinceProvider from "@/context/province.context";
import withAuth from "@/hoc/withAuth";
import { ILayoutProps } from "@/interface/layout.interface";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

interface ICartLayoutProps extends ILayoutProps {
    product: ReactNode;
    service: ReactNode;
}

function CheckoutLayout({ product, service }: ICartLayoutProps) {
    const search = useSearchParams();

    const type = search.get("type");

    if (!type) {
        return <p>Type of checkout must be provided!</p>;
    }

    return (
        <div className="w-full h-fit py-10 box-border">
            <CartProductContactProvider>
                <CartServiceContactProvider>
                    <ProvinceProvider>
                        <div className="container px-4 gap-5 flex w-full box-border h-fit">
                            {type === "service" && service}
                            {type === "product" && product}
                        </div>
                    </ProvinceProvider>
                </CartServiceContactProvider>
            </CartProductContactProvider>
        </div>
    );
}

export default withAuth(CheckoutLayout);
