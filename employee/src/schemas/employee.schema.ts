import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { EGender } from "@/enum/gender.enum";
import { z } from "zod";

const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

export const employeeFormSchema = z.object({
    phone: z.string().regex(regexPhoneNumber, { message: ZOD_MESSAGE.phone }),
    firstname: z
        .string()
        .min(2, { message: ZOD_MESSAGE.min(2, "Tên") })
        .max(20, { message: ZOD_MESSAGE.max(20, "Tên") }),
    lastname: z
        .string()
        .min(2, { message: ZOD_MESSAGE.min(2, "Tên đệm") })
        .max(20, { message: ZOD_MESSAGE.max(20, "Tên đệm") }),

    eRoleId: z.string().min(1, { message: ZOD_MESSAGE.require("Chức vụ") }),
    username: z
        .string()
        .min(2, { message: ZOD_MESSAGE.min(2, "Tên đăng nhập") })
        .max(20, { message: ZOD_MESSAGE.max(20, "Tên đăng nhập") }),
    password: z
        .string()
        .min(1, { message: ZOD_MESSAGE.min(1, "Mật khẩu") })
        .max(20, { message: ZOD_MESSAGE.max(20, "Mật khẩu") }),
    birthday: z.date().optional(),
    gender: z.nativeEnum(EGender),
    image: z.instanceof(File).optional(),
});

export const employeeUpdateFormSchema = z.object({
    phone: z.string().regex(regexPhoneNumber, { message: ZOD_MESSAGE.phone }),
    firstname: z
        .string()
        .min(2, { message: ZOD_MESSAGE.min(2, "Tên") })
        .max(20, { message: ZOD_MESSAGE.max(20, "Tên") }),
    lastname: z
        .string()
        .min(2, { message: ZOD_MESSAGE.min(2, "Tên đệm") })
        .max(20, { message: ZOD_MESSAGE.max(20, "Tên đệm") }),

    eRoleId: z.string().min(1, { message: ZOD_MESSAGE.require("Chức vụ") }),
    username: z
        .string()
        .min(2, { message: ZOD_MESSAGE.min(2, "Tên đăng nhập") })
        .max(20, { message: ZOD_MESSAGE.max(20, "Tên đăng nhập") }),
    avatar: z.string().optional(),
    birthday: z.date().optional(),
    gender: z.nativeEnum(EGender),
    image: z.instanceof(File).optional(),
});
