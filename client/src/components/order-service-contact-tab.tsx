"use client";

import { placeOrderServiceSchema } from "@/schema/order.schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import RequireField from "./required-field";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface IOrderServiceContactTabProps {
    form: UseFormReturn<z.infer<typeof placeOrderServiceSchema>>;
}

export default function OrderServiceContactTab({
    form,
}: IOrderServiceContactTabProps) {
    return (
        <div className="flex flex-col gap-2 h-fit">
            <FormField
                control={form.control}
                name="contact.name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Tên người đặt
                            <RequireField />
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="Tên người đặt"
                                className="text-left"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="contact.phone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Số điện thoại
                            <RequireField />
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="Số điện thoại"
                                className="text-left"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="flex-1">
                <FormField
                    control={form.control}
                    name="contact.note"
                    render={({ field }) => (
                        <FormItem className="h-full flex flex-col">
                            <FormLabel>Ghi chú</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Mô tả chi tiết hoặc một số thông tin khác về dịch vụ muốn đặt"
                                    className="text-left resize-none flex-1 min-h-[200px]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
