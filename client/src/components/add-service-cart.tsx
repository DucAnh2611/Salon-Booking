"use client";

import { IApiAddServiceCart } from "@/interface/cart.interface";
import { IServiceDetail } from "@/interface/service.interface";
import { addServiceCart } from "@/lib/actions/cart.action";
import { addServiceToCart } from "@/schema/cart.schema";
import { zodResolver } from "@hookform/resolvers/zod";
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
                    <div>
                        <Button type="submit">Thêm vào giỏ hàng</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
