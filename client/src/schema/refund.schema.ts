import { z } from "zod";

export const createRefundRequestSchema = z.object({
    bankBin: z.string().min(1, { message: "Mã số ngân hàng là bắt buộc" }),
    bankCode: z.string().min(1, { message: "Mã ngân hàng là bắt buộc" }),
    bankAccount: z
        .string()
        .min(1, { message: "Số tài khoản ngân hàng là bắt buộc" }),
    amount: z.coerce
        .number({ message: "Số tiền phải là số nguyên" })
        .positive({ message: "Số tiền phải lớn hơn 0" }),
    desc: z.string().optional(),
});
