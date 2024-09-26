"use client";

import useCartService from "@/hook/useCartService.hook";
import { IServiceItemCartBooking } from "@/interface/service.interface";
import { IApiCheckOverlapServiceEmployeeItem } from "@/interface/shift.interface";
import { checkOverlapServiceEmployee } from "@/lib/actions/shift.action";
import { placeOrderServiceSchema } from "@/schema/order.schema";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import DialogBookingService from "./dialog-booking-service";
import { Button } from "./ui/button";
import { FormField, FormMessage } from "./ui/form";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";

interface IOrderServiceItemTabProps {
    form: UseFormReturn<z.infer<typeof placeOrderServiceSchema>>;
}

export default function OrderServiceItemTab({
    form,
}: IOrderServiceItemTabProps) {
    const { selectItems, setSelectItems } = useCartService();
    const [selectBookingItems, SetSelectBookingItems] = useState<
        IServiceItemCartBooking[]
    >([]);

    const onConfirmBookingService = async (item: IServiceItemCartBooking) => {
        if (!(item.bookingTime && item.employee && item.shift && item.service))
            return;

        const newItems = selectItems.map((i) => (i.id === item.id ? item : i));

        const { response } = await checkOverlapServiceEmployee({
            services: newItems
                .filter(
                    (i) =>
                        i.employee &&
                        i.employee.employeeId === item.employee?.employeeId
                )
                .reduce((acc: IApiCheckOverlapServiceEmployeeItem[], i) => {
                    if (i.serviceId && i.employee && i.bookingTime && i.shift) {
                        acc.push({
                            serviceId: i.serviceId,
                            bookingTime: i.bookingTime,
                            shiftId: i.shift.id,
                        });
                    }
                    return acc;
                }, []),
            employeeId: item.employee.employeeId,
        });

        if (response) {
            setSelectItems(newItems);
        } else {
            toast({
                title: "Thất bại",
                description:
                    "Thời gian đặt nhân viên đã trùng lặp với thời gian hoặc thời gian làm việc của dịch vụ khác",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        SetSelectBookingItems(selectItems);
    }, [selectItems]);

    return (
        <div>
            <FormField
                control={form.control}
                name="services"
                render={({ ...field }) => (
                    <div className="flex flex-col w-full h-fit gap-2">
                        <FormMessage />
                        {!selectItems.length && <p>Danh sách mua hàng trống</p>}
                        {selectItems.length &&
                            selectBookingItems.map((serviceItem) => (
                                <div key={serviceItem.id} className="border">
                                    <div className="gap-2 w-full border-b p-3 box-border py-4 flex justify-between items-center">
                                        <Label>
                                            {serviceItem.service.name}
                                        </Label>
                                        <DialogBookingService
                                            onConfirm={onConfirmBookingService}
                                            trigger={
                                                <Button
                                                    size={"sm"}
                                                    type="button"
                                                >
                                                    Chọn nhân viên
                                                </Button>
                                            }
                                            serviceItem={serviceItem}
                                        />
                                    </div>
                                    <div>
                                        <p>{serviceItem.service.name}</p>
                                        <p>{serviceItem.service.price}</p>
                                        <p>
                                            Thời lượng:{" "}
                                            {serviceItem.service.duration} phút
                                        </p>
                                    </div>
                                    <div>
                                        {serviceItem.bookingTime ? (
                                            <p>
                                                {format(
                                                    serviceItem.bookingTime,
                                                    "yyyy/MM/dd HH:mm"
                                                )}
                                            </p>
                                        ) : (
                                            <p>Chưa chọn ngày</p>
                                        )}
                                        {serviceItem.employee ? (
                                            <p>
                                                {
                                                    serviceItem.employee
                                                        .employee.userBase
                                                        .firstname
                                                }{" "}
                                                {
                                                    serviceItem.employee
                                                        .employee.userBase
                                                        .lastname
                                                }
                                            </p>
                                        ) : (
                                            <p>Chưa chọn Nhân viên</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            />
        </div>
    );
}
