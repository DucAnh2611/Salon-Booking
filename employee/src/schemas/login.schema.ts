import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { z } from "zod";

export const loginFormSchema = z.object({
    username: z
        .string()
        .min(2, {
            message: ZOD_MESSAGE.min(2, "Tên đăng nhập"),
        })
        .max(20, { message: ZOD_MESSAGE.max(20, "Tên đăng nhập") }),
    password: z
        .string()
        .min(1, {
            message: ZOD_MESSAGE.min(1, "Mật khẩu"),
        })
        .max(20, { message: ZOD_MESSAGE.max(20, "Mật khẩu") }),
});
