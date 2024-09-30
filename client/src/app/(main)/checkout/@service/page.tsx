"use client";

import OrderServiceAmount from "@/components/order-service-amount";
import OrderServiceContactTab from "@/components/order-service-contact-tab";
import OrderServiceItemTab from "@/components/order-service-items-tab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import BookingProvider from "@/context/booking.context";
import { EOrderPaymentType } from "@/enum/order.enum";
import useCartService from "@/hook/useCartService.hook";
import { IPlaceOrderService } from "@/interface/order.interface";
import { placeOrderService } from "@/lib/actions/order.action";
import { placeOrderServiceSchema } from "@/schema/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CheckoutServicePage() {
    const router = useRouter();
    const { selectItems, paymentType, setSelectItems } = useCartService();

    const form = useForm<z.infer<typeof placeOrderServiceSchema>>({
        defaultValues: {
            contact: {
                name: "",
                note: "",
                phone: "",
            },
            paymentType: EOrderPaymentType.CASH,
            services: [],
        },
        resolver: zodResolver(placeOrderServiceSchema),
    });

    const handleSubmit = async () => {
        const bodySubmit: IPlaceOrderService = form.getValues();

        const { response, error } = await placeOrderService(bodySubmit);
        if (response) {
            toast({
                title: "Thành công",
                description: "Đặt thành công đơn hàng",
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
            "services",
            selectItems.map((item) => ({
                itemId: item.id,
                serviceId: item.serviceId,
                employeeId: item.employee ? item.employee.employeeId : "",
                shiftId: item.shift ? item.shift.id : "",
                bookingTime: item.bookingTime,
            }))
        );
    }, [selectItems]);

    useMemo(() => {
        form.setValue("paymentType", paymentType);
    }, [paymentType]);

    return (
        <BookingProvider>
            <div className="w-full">
                <div className="">
                    <div className="mb-2">
                        <Button
                            className="w-fit gap-2"
                            type="button"
                            variant="outline"
                            asChild
                        >
                            <Link href={"cart?type=service"}>
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
                                    <Card className="flex-1 box-border h-fit">
                                        <CardHeader className="p-4">
                                            <CardTitle>
                                                Danh sách dịch vụ và nhân viên
                                            </CardTitle>
                                        </CardHeader>
                                        <Separator
                                            className=""
                                            orientation="horizontal"
                                        />
                                        <CardContent className="p-4">
                                            <OrderServiceItemTab form={form} />
                                        </CardContent>
                                    </Card>

                                    <Card className="flex-1 box-border h-fit">
                                        <CardHeader className="p-4">
                                            <CardTitle>
                                                Thông tin liên lạc
                                            </CardTitle>
                                        </CardHeader>
                                        <Separator
                                            className=""
                                            orientation="horizontal"
                                        />
                                        <CardContent className="p-4">
                                            <OrderServiceContactTab
                                                form={form}
                                            />
                                        </CardContent>
                                    </Card>

                                    <div className="w-[400px] h-auto">
                                        <div className="w-full h-fit flex-col flex gap-5 sticky top-5 left-0 ">
                                            <OrderServiceAmount />

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
        </BookingProvider>
    );
}
