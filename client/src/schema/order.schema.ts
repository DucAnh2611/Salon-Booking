import { EOrderPaymentType } from "@/enum/order.enum";
import { z } from "zod";

const vietnamPhoneRegex = /^(03|05|07|08|09)(\d{1,3} ?){3}\d{3}$/;

export const placeOrderContact = z.object({
    name: z.string().min(1, { message: "Tên khách hàng là bắt buộc" }),
    address: z.string().min(1, { message: "Địa chỉ nhận hàng là bắt buộc" }),
    phone: z
        .string()
        .min(1, { message: "số điện thoại ngưỜi nhận là bắt buộc" })
        .regex(vietnamPhoneRegex, "Số điện thoại không đúng định dạng"),
    note: z.string().default("").optional(),
});

export const paymentType = z.nativeEnum(EOrderPaymentType);

export const placeOrderProductItem = z.object({
    itemId: z.string(),
    productId: z.string(),
    productTypeId: z.string().optional(),
    quantity: z.coerce.number().positive().int(),
});

export const placeOrderProductSchema = z.object({
    contact: placeOrderContact,
    paymentType: paymentType,
    products: placeOrderProductItem.array(),
});

export const cancelOrderSchema = z.object({
    orderId: z.string().min(1),
    reason: z.string().min(1),
});

export const cancelRefundSchema = z.object({
    requestId: z.string().min(1),
    orderId: z.string().min(1),
    note: z.string().min(1),
});

export const cancelTransactioncSchema = z.object({
    transactionId: z.string().min(1),
    note: z.string().min(1, { message: "Ghi chú là bắt buộc" }),
});

export const placeOrderServiceContact = z.object({
    name: z.string().min(1, { message: "Tên khách hàng là bắt buộc" }),
    phone: z
        .string()
        .min(1, { message: "Số điện thoại khách hàng là bắt buộc" })
        .regex(vietnamPhoneRegex, "Số điện thoại không đúng định dạng"),
    note: z.string().default("").optional(),
});

export const placeOrderServiceItem = z.object({
    itemId: z.string().min(1),
    employeeId: z.string().min(1).nullable(),
    serviceId: z.string().min(1),
    shiftId: z.string().min(1).nullable(),
    bookingTime: z.date().nullable(),
});

export const placeOrderServiceSchema = z
    .object({
        contact: placeOrderServiceContact,
        paymentType: paymentType,
        services: z.array(placeOrderServiceItem),
    })
    .superRefine(({ services }, ctx) => {
        const ser = services.find(
            (s) =>
                !s.employeeId ||
                !s.itemId ||
                !s.shiftId ||
                !s.serviceId ||
                !s.bookingTime
        );

        if (ser) {
            ctx.addIssue({
                path: ["services"],
                code: "custom",
                message: "Vui lòng chọn nhân viên, giờ làm của từng dịch vụ",
            });
        }
    });
