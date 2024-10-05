"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import withAuth from "@/hoc/withAuth";
import { ILayoutProps } from "@/interface/layout.interface";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";
interface ICartLayoutProps extends ILayoutProps {
    product: ReactNode;
    service: ReactNode;
}

function CartLayout({ product, service }: ICartLayoutProps) {
    const search = useSearchParams();

    const type = search.get("type") || "product";

    return (
        <div className="w-full h-fit py-10 box-border">
            <div className="container px-4 gap-5 flex w-full box-border h-fit">
                <Tabs value={type} className="flex flex-col h-full w-full">
                    <TabsList className="w-fit h-fit">
                        <TabsTrigger value="product">
                            <Link href={"cart?type=product"}>Sản phẩm</Link>
                        </TabsTrigger>
                        <TabsTrigger value="service" asChild>
                            <Link href={"cart?type=service"}>Dịch vụ</Link>
                        </TabsTrigger>
                    </TabsList>
                    {type === "product" && (
                        <TabsContent value="product" className="flex-1">
                            {product}
                        </TabsContent>
                    )}
                    {type === "service" && (
                        <TabsContent value="service" className="flex-1">
                            {service}
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </div>
    );
}
export default withAuth(CartLayout);
