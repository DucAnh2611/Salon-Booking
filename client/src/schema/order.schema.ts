import { EOrderPaymentType } from "@/enum/order.enum";
import { z } from "zod";

export const placeOrderContact = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().min(1),
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
