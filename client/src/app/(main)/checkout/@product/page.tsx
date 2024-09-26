"use client";

import OrderProductAmount from "@/components/order-product-amount";
import OrderProductContactTab from "@/components/order-product-contact-tab";
import OrderProductItemTab from "@/components/order-product-items-tab";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { EOrderPaymentType } from "@/enum/order.enum";
import useCartProduct from "@/hook/useCartProduct.hook";
import { IPlaceOrderProduct } from "@/interface/order.interface";
import { placeOrderProduct } from "@/lib/actions/order.action";
import { placeOrderProductSchema } from "@/schema/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const tabs = [
    {
        value: "cart-items",
        Tab: OrderProductItemTab,
        title: "Danh sách sản phẩm",
    },
    {
        value: "order-contact",
        Tab: OrderProductContactTab,
        title: "Thông tin liên hệ",
    },
];

export default function CheckoutProductPage() {
    const router = useRouter();
    const { selectItems, paymentType, setSelectItems } = useCartProduct();

    const form = useForm<z.infer<typeof placeOrderProductSchema>>({
        defaultValues: {
            contact: {
                address: "",
                name: "",
                note: "",
                phone: "",
            },
            paymentType: EOrderPaymentType.CASH,
            products: [],
        },
        resolver: zodResolver(placeOrderProductSchema),
    });

    const handleSubmit = async () => {
        const bodySubmit: IPlaceOrderProduct = form.getValues();
        const { response, error } = await placeOrderProduct(bodySubmit);

        if (response) {
            toast({
                title: "Thành công",
                description: "Thanh toán thành công đơn hàng",
                duration: 1000,
            });
            setSelectItems([]);

            router.push(`/tracking?code=${response.result.code}`);
        } else {
            toast({
                title: "Thất bại",
                description: error?.message,
                variant: "destructive",
            });
        }
    };

    useMemo(() => {
        form.setValue(
            "products",
            selectItems.map((item) => ({
                itemId: item.id,
                productId: item.productId,
                ...(item.productTypeId
                    ? { productTypeId: item.productTypeId }
                    : {}),
                quantity: item.quantity,
            }))
        );
    }, [selectItems]);

    useMemo(() => {
        form.setValue("paymentType", paymentType);
    }, [paymentType]);

    return (
        <div className="w-full">
            <div className="">
                <div className="mb-2">
                    <Button
                        className="w-fit gap-2"
                        type="button"
                        variant="outline"
                        asChild
                    >
                        <Link href={"cart?type=product"}>
                            <ChevronLeft size={15} />
                            Quay lại giỏ hàng
                        </Link>
                    </Button>
                </div>
                <div>
                    {!!selectItems.length ? (
                        <Form {...form}>
                            <form
                                className="flex gap-5 w-full h-fit"
                                onSubmit={form.handleSubmit(handleSubmit)}
                            >
                                <Card className="flex-1 p-4 box-border">
                                    <Tabs
                                        defaultValue={tabs[0].value}
                                        className="flex flex-col h-full"
                                    >
                                        <TabsList className="w-fit h-fit">
                                            {tabs.map(({ value, title }) => (
                                                <TabsTrigger
                                                    key={value}
                                                    value={value}
                                                >
                                                    {title}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                        {tabs.map(({ value, Tab }) => (
                                            <TabsContent
                                                key={value}
                                                value={value}
                                                className="flex-1"
                                            >
                                                <Tab form={form} />
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                </Card>

                                <div className="w-[400px] h-auto">
                                    <div className="w-full h-fit flex-col flex gap-5 sticky top-5 left-0 ">
                                        <OrderProductAmount />

                                        <div className="w-full flex gap-2">
                                            <Button
                                                className="w-full !py-3 h-fit text-base"
                                                type="submit"
                                            >
                                                Đặt đơn
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    ) : (
                        <div>
                            <p>Không có sản phẩm nào được chọn</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
