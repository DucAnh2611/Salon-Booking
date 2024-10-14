"use client";

import useCartService from "@/hook/useCartService.hook";
import { IApiAddServiceCart } from "@/interface/cart.interface";
import { IServiceDetail } from "@/interface/service.interface";
import { addServiceCart } from "@/lib/actions/cart.action";
import { addServiceToCart } from "@/schema/cart.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Landmark, ShoppingCart, Undo2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import { toast } from "./ui/use-toast";

interface IAddServiceCartProps {
    service: IServiceDetail;
}

export default function AddServiceCart({ service }: IAddServiceCartProps) {
    const { getCount } = useCartService();

    const form = useForm<z.infer<typeof addServiceToCart>>({
        resolver: zodResolver(addServiceToCart),
        defaultValues: {
            serviceId: "",
        },
    });

    const handleSubmit = async () => {
        const formData = form.getValues();

        const body: IApiAddServiceCart = { ...formData };

        const { response } = await addServiceCart(body);

        if (response) {
            toast({
                title: "Thêm thành công",
                description: "Thêm dịch vụ vào giỏ hàng thành công",
                duration: 1500,
            });
            getCount();
        } else {
            toast({
                title: "Thêm thất bại",
                description:
                    "Đã có lỗi trong quá trình thêm dịch vụ vào giỏ hàng.",
                variant: "destructive",
                duration: 1500,
            });
        }
    };

    useEffect(() => {
        form.setValue("serviceId", service.id);
    }, [service]);

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="space-y-3 mt-3">
                        <Button type="submit" className="gap-2 items-center">
                            <ShoppingCart size={15} />
                            Thêm vào giỏ hàng
                        </Button>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm font-medium  text-muted-foreground">
                                <Undo2 size={20} />
                                <span>
                                    Hoàn tiền 100% nếu dịch vụ không đúng theo
                                    mô tả
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm font-medium  text-muted-foreground">
                                <Landmark size={20} />
                                <span>Thanh toán qua tài khoản ngân hàng.</span>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
