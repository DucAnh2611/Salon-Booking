"use client";

import { EOrderPaymentType } from "@/enum/order.enum";
import useCartProduct from "@/hook/useCartProduct.hook";
import { cn } from "@/lib/utils";
import { Banknote, CheckIcon, CreditCard, LoaderCircle } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface IOrderAmountProps {}

export default function OrderProductAmount({}: IOrderAmountProps) {
    const { cartAmount, loadingCartAmount, paymentType, setPaymentType } =
        useCartProduct();

    const handleChangePaymentType = (type: EOrderPaymentType) => () => {
        setPaymentType(type);
    };

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
                        defaultValue={["cart-total", "payment-type"]}
                    >
                        <AccordionItem value="payment-type">
                            <AccordionTrigger>
                                Phương thức thanh toán
                            </AccordionTrigger>
                            <AccordionContent>
                                <div>
                                    <div className="w-full h-fit group/cash flex flex-col gap-0">
                                        <Button
                                            className="border-y box-border p-3 py-4 h-fit flex w-full justify-start relative"
                                            variant={
                                                paymentType ===
                                                EOrderPaymentType.CASH
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            onClick={handleChangePaymentType(
                                                EOrderPaymentType.CASH
                                            )}
                                            type="button"
                                        >
                                            <div className="flex gap-2 items-center">
                                                <Banknote
                                                    size={15}
                                                    className="w-5"
                                                />
                                                <p>Tiền mặt</p>
                                            </div>
                                            {paymentType ===
                                                EOrderPaymentType.CASH && (
                                                <CheckIcon
                                                    size={15}
                                                    className={cn(
                                                        "absolute right-3 top-1/2 -translate-y-1/2"
                                                    )}
                                                />
                                            )}
                                        </Button>
                                        <div
                                            className={cn(
                                                "h-0 duration-100 overflow-hidden w-full px-[15px]",
                                                paymentType ===
                                                    EOrderPaymentType.CASH
                                                    ? "h-fit py-[15px]"
                                                    : "group-hover/cash:h-fit group-hover/cash:py-[15px]"
                                            )}
                                        >
                                            <p className="w-full break-words whitespace-normal">
                                                Thanh toán khi nhận được hàng.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full h-fit group/bank flex flex-col gap-0">
                                        <Button
                                            className="border-y box-border p-3 py-4 h-fit flex w-full justify-start relative"
                                            variant={
                                                paymentType ===
                                                EOrderPaymentType.BANK
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            onClick={handleChangePaymentType(
                                                EOrderPaymentType.BANK
                                            )}
                                            type="button"
                                        >
                                            <div className="flex gap-2 items-center">
                                                <CreditCard
                                                    size={15}
                                                    className="w-5"
                                                />
                                                <p>Chuyển khoản ngân hàng</p>
                                            </div>
                                            {paymentType ===
                                                EOrderPaymentType.BANK && (
                                                <CheckIcon
                                                    size={15}
                                                    className={cn(
                                                        "absolute right-3 top-1/2 -translate-y-1/2"
                                                    )}
                                                />
                                            )}
                                        </Button>
                                        <div
                                            className={cn(
                                                "h-0 duration-100 overflow-hidden w-full px-[15px]",
                                                paymentType ===
                                                    EOrderPaymentType.BANK
                                                    ? "h-fit py-[15px]"
                                                    : "group-hover/bank:h-fit group-hover/bank:py-[15px]"
                                            )}
                                        >
                                            <p className="w-full break-words whitespace-normal">
                                                Thanh toán bằng mã QR có thể gửi
                                                yêu cầu hoàn tiền nếu muốn hủy
                                                đơn hàng.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
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
                    <p className="text-xs text-muted-foreground text-center mt-3">
                        Bằng việc{" "}
                        <em className="text-primary">xác nhận đặt hàng</em>, bạn
                        đã đảm bảo nhập đúng các thông tin về đơn hàng và phương
                        thức thanh toán.
                    </p>
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
