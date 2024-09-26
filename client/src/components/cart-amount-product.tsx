"use client";

import useCartProduct from "@/hook/useCartProduct.hook";
import { LoaderCircle } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface ICartAmountProps {}

export default function CartProductAmount({}: ICartAmountProps) {
    const { cartAmount, loadingCartAmount } = useCartProduct();

    return (
        <Card className="box-border w-full h-fit relative">
            <CardHeader className="p-4">
                <CardTitle>Thông tin thanh toán</CardTitle>
            </CardHeader>
            <Separator className="" orientation="horizontal" />

            <CardContent className="p-4 pt-0">
                <div className="w-full">
                    <Accordion
                        type="multiple"
                        className="p-0"
                        defaultValue={["cart-total"]}
                    >
                        <AccordionItem value="cart-total">
                            <AccordionTrigger>
                                Thông tin giá tiền
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <p className="text-sm font-medium ">
                                            Tổng giỏ hàng:
                                        </p>
                                        <p>
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(cartAmount.cartAmount)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <p className="text-sm font-medium ">
                                            Tổng thuế:
                                        </p>
                                        <p>
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(cartAmount.taxAmount)}
                                        </p>
                                        <p className="italic text-primary text-xs h-fit">
                                            {`( ${cartAmount.tax * 100}% )`}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <p className="text-sm font-medium ">
                                            Phí giao hàng:
                                        </p>
                                        <p>Miễn phí</p>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <div className="flex gap-2 items-center mt-5 font-medium text-lg ">
                        <p className="font-bold">Tổng đơn hàng:</p>
                        <p>
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(cartAmount.total)}
                        </p>
                    </div>
                </div>
            </CardContent>

            {loadingCartAmount && (
                <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center z-[1] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:bg-muted before:opacity-50 backdrop-blur-sm before:z-[0]">
                    <div className="flex gap-2 items-center h-fit z-[1]">
                        <LoaderCircle size={15} className="animate-spin" />
                        <p className="text-sm">Đang xử lý</p>
                    </div>
                </div>
            )}
        </Card>
    );
}
