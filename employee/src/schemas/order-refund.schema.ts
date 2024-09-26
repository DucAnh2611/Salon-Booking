import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { z } from "zod";

export const approvedRefundRequestSchema = z.object({
    requestId: z
        .string()
        .min(1, { message: ZOD_MESSAGE.require("Mã yêu cầu hoàn tiền") }),
    bankTransactionCode: z
        .string()
        .min(5, { message: ZOD_MESSAGE.min(5, "Mã chuyển tiền ngân hàng") }),
    mediaUrl: z
        .string()
        .min(1, { message: ZOD_MESSAGE.require("Ảnh xác thực") }),
    note: z.string().optional(),
});

export const declineRefundRequestSchema = z.object({
    requestId: z
        .string()
        .min(1, { message: ZOD_MESSAGE.require("Mã yêu cầu hoàn tiền") }),
    note: z.string().min(10, { message: ZOD_MESSAGE.min(10, "Lí do từ chối") }),
});
