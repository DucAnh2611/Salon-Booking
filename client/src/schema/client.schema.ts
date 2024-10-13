import { EGender } from "@/enum/gender.enum";
import dayjs from "dayjs";
import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = {
    image: [
        "jpg/image",
        "jpeg/image",
        "png/image",
        "gif/image",
        "bmp/image",
        "webp/image",
    ],
    video: [
        "mp4/video",
        "mov/video",
        "avi/video",
        "mkv/video",
        "flv/video",
        "webm/video",
    ],
};

const vietnamPhoneRegex = /^(03|05|07|08|09)\d{8}$/;

const minDate = dayjs().subtract(15, "year").startOf("day");

export const clientUpdateSchema = z.object({
    firstname: z
        .string()
        .min(1, "Bắt buộc")
        .max(50, "Tên gọi chỉ có thể chứa tối đa 50 ký tự"),
    lastname: z
        .string()
        .min(1, "Bắt buộc")
        .max(50, "Họ chỉ có thể chứa tối đa 50 ký tự"),
    phone: z
        .string()
        .regex(vietnamPhoneRegex, "Số điện thoại không đúng định dạng"),
    email: z.string().email({ message: "Không đúng đỊnh dạng email" }),
    birthday: z
        .date()
        .max(minDate.toDate(), "Tài khoản phải đủ ít nhất 15 tuổi"),
    gender: z.nativeEnum(EGender, {
        message: "Giới tính không được lựa chọn",
    }),
});

export const resetPasswordSchema = z
    .object({
        token: z.string(),
        email: z.string().email({ message: "Không đúng đỊnh dạng email" }),
        newPassword: z
            .string()
            .min(8, "Mật khẩu phải dài ít nhất 8 ký tự")
            .regex(
                /[a-z]/,
                "Mật khẩu phải bao gồm ít nhất 1 chữ cái viết thường"
            )
            .regex(/[A-Z]/, "Mật khẩu phải bao gồm ít nhất 1 chữ cái viết hoa")
            .regex(/[0-9]/, "Mật khẩu ít nhất phải bao gồm 1 chữ số")
            .regex(
                /[@$!%*?&#]/,
                "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (@$!%*?&#)"
            ),
        confirmPassword: z
            .string()
            .min(8, "Mật khẩu phải dài ít nhất 8 ký tự")
            .regex(
                /[a-z]/,
                "Mật khẩu phải bao gồm ít nhất 1 chữ cái viết thường"
            )
            .regex(/[A-Z]/, "Mật khẩu phải bao gồm ít nhất 1 chữ cái viết hoa")
            .regex(/[0-9]/, "Mật khẩu ít nhất phải bao gồm 1 chữ số")
            .regex(
                /[@$!%*?&#]/,
                "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (@$!%*?&#)"
            ),
    })
    .superRefine(({ newPassword, confirmPassword }, ctx) => {
        if (newPassword !== confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Mật khẩu xác nhận không trùng khớp.",
                path: ["confirmPassword"],
            });
        }
    });
