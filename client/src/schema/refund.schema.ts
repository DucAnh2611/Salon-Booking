import { z } from "zod";

export const createRefundRequestSchema = z.object({
    bankBin: z.string().min(1),
    bankAccount: z.string().min(1),
    bankName: z.string().min(1),
    amount: z.coerce.number().positive(),
    desc: z.string().optional(),
});
