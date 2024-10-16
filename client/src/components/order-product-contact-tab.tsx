"use client";

import useCartProductContact from "@/hook/useCartProductContact.hook";
import { joinString } from "@/lib/string";
import { placeOrderProductSchema } from "@/schema/order.schema";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import DialogSelectProvince from "./dialog-province";
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

interface IOrderProductContactTabProps {
    form: UseFormReturn<z.infer<typeof placeOrderProductSchema>>;
}

export default function OrderProductContactTab({
    form,
}: IOrderProductContactTabProps) {
    const {
        contact: {
            address: { district, province, street, ward },
        },
    } = useCartProductContact();

    useEffect(() => {
        console.log(district, province, street, ward);
        form.setValue(
            "contact.address",
            district && province && ward && street
                ? joinString({
                      joinString: ", ",
                      strings: [
                          street,
                          ward.name,
                          district.name,
                          province.name,
                      ],
                  })
                : street
                ? street
                : ""
        );
    }, [district, province, street, ward]);

    return (
        <div className="flex flex-col gap-2 h-fit">
            <FormField
                control={form.control}
                name="contact.name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Tên người nhận hàng
                            <RequireField />
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="Tên người nhận hàng"
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
            <FormField
                control={form.control}
                name="contact.address"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Địa chỉ
                            <RequireField />
                        </FormLabel>
                        <FormControl>
                            <DialogSelectProvince
                                trigger={
                                    <Input
                                        {...field}
                                        placeholder="Địa chỉ nhận hàng"
                                        className="text-left cursor-pointer"
                                    />
                                }
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
                                    placeholder="Mô tả chi tiết (số đường, hẻm,...) hoặc một số thông tin khác"
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
