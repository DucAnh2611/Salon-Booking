import { z } from "zod";

export const addProductToCartSchema = z.object({
    productId: z.string().min(1, "required"),
    productTypeId: z.string().optional(),
    quantity: z.coerce
        .number({ message: "number" })
        .positive({ message: "positive" })
        .int({ message: "integer" }),
});

export const addServiceToCart = z.object({
    serviceId: z.string().min(1, "required"),
});
