import { z } from "zod";

export const settingUpdateSchema = z.object({
    otpEmailTime: z.coerce
        .number({ message: "Thời gian hết hạn phải là một số" })
        .int({ message: "Thời gian hết hạn phải là số nguyên" })
        .positive({ message: "Thời gian hết hạn phải là số dương" }),
    otpEmailUnit: z.string().min(1),

    orderServiceConfirmTime: z.coerce
        .number({ message: "Thời gian xác nhận đơn hàng phải là một số" })
        .int({ message: "Thời gian xác nhận đơn hàng phải là số nguyên" })
        .positive({ message: "Thời gian xác nhận đơn hàng phải là số dương" }),
    orderServiceConfirmUnit: z.string().min(1),

    resetPasswordTime: z.coerce
        .number({ message: "Thời gian đặt lại mật khẩu phải là một số" })
        .int({ message: "Thời gian đặt lại mật khẩu phải là số nguyên" })
        .positive({ message: "Thời gian đặt lại mật khẩu phải là số dương" }),
    resetPasswordUnit: z.string().min(1),
});
