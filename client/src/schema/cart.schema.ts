import { z } from "zod";

export const addToCartSchema = z.object({
    productId: z.string().min(1, "required"),
    productTypeId: z.string().optional(),
    quantity: z.coerce
        .number({ message: "number" })
        .positive({ message: "positive" })
        .int({ message: "integer" }),
});
