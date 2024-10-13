import { z } from "zod";

export const settingUpdateSchema = z.object({
    otpEmailTime: z.coerce.number().int().positive(),
    otpEmailUnit: z.string().min(1),

    orderServiceConfirmTime: z.coerce.number().int().positive(),
    orderServiceConfirmUnit: z.string().min(1),

    resetPasswordTime: z.coerce.number().int().positive(),
    resetPasswordUnit: z.string().min(1),
});
