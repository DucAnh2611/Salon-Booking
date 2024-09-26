import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { EOrderStatus } from "@/enum/order.enum";
import { z } from "zod";

export const addOrderStateSchema = z.object({
    orderId: z.string().min(1, { message: ZOD_MESSAGE.require("ID đơn hàng") }),
    state: z.nativeEnum(EOrderStatus, {
        message: "Trạng thái đơn hàng không hợp lệ",
    }),
    description: z.string().optional(),
});

export const cancelOrder = z.object({
    orderId: z.string().min(1, { message: ZOD_MESSAGE.require("ID đơn hàng") }),
    reason: z.string(),
});
