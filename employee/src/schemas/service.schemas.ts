import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { EServiceEmployeeExperience } from "@/enum/service.enum";
import { z } from "zod";

export const serviceMediaSchema = z.object({
    mediaId: z.string().optional(),
    mediaUrl: z.string().optional(),
    isThumbnail: z.boolean().default(false),
});

export const createServiceBaseSchema = z.object({
    name: z.string().min(1, { message: ZOD_MESSAGE.positive("Tên dịch vụ") }),
    price: z.coerce
        .number({ message: ZOD_MESSAGE.number("Giá dịch vụ") })
        .int({ message: ZOD_MESSAGE.int("Giá dịch vụ") })
        .positive({ message: ZOD_MESSAGE.positive("Giá dịch vụ") }),
    duration: z.coerce
        .number({ message: ZOD_MESSAGE.number("Thời gian") })
        .int({ message: ZOD_MESSAGE.int("Thời gian") })
        .positive({ message: ZOD_MESSAGE.positive("Thời gian") }),
    description: z.string().optional().default(""),
    categoryId: z.string().min(2, { message: ZOD_MESSAGE.require("Danh mục") }),
    medias: z.array(serviceMediaSchema),
});

export const createServiceEmployeeSchema = z.object({
    employeeId: z
        .string()
        .min(1, { message: ZOD_MESSAGE.require("Mã nhân viên") }),
    experience: z.nativeEnum(EServiceEmployeeExperience, {
        message: ZOD_MESSAGE.invalidEnum("Kinh nghiệm"),
    }),
});

export const createServiceStepSchema = z.object({
    name: z.string().min(1, { message: ZOD_MESSAGE.require("Tên bước") }),
    description: z
        .string()
        .min(1, { message: ZOD_MESSAGE.require("Mô tả dịch vụ") }),
    step: z.coerce
        .number({ message: ZOD_MESSAGE.number("Số bước") })
        .int({ message: ZOD_MESSAGE.int("Số bước") })
        .positive({ message: ZOD_MESSAGE.positive("Số bước") }),
    thumbnailId: z.string().optional(),
    thumbnailUrl: z.string().optional(),
});

export const createServiceSchema = z.object({
    base: createServiceBaseSchema,
    employees: z.array(createServiceEmployeeSchema),
    steps: z.array(createServiceStepSchema),
});

export const updateServiceMediaSchema = z.object({
    mediaId: z.string().optional(),
    mediaUrl: z.string().optional(),
    isThumbnail: z.boolean().default(false),
});

export const updateServiceBaseSchema = z.object({
    serviceId: z.string(),
    name: z.string().min(1, { message: ZOD_MESSAGE.positive("Tên dịch vụ") }),
    price: z.coerce
        .number({ message: ZOD_MESSAGE.number("Giá dịch vụ") })
        .int({ message: ZOD_MESSAGE.int("Giá dịch vụ") })
        .positive({ message: ZOD_MESSAGE.positive("Giá dịch vụ") }),
    duration: z.coerce
        .number({ message: ZOD_MESSAGE.number("Thời gian") })
        .int({ message: ZOD_MESSAGE.int("Thời gian") })
        .positive({ message: ZOD_MESSAGE.positive("Thời gian") }),
    description: z.string().optional().default(""),
    categoryId: z.string().min(2, { message: ZOD_MESSAGE.require("Danh mục") }),
    medias: z.array(updateServiceMediaSchema),
});

export const updateServiceEmployeeSchema = z.object({
    employeeId: z
        .string()
        .min(1, { message: ZOD_MESSAGE.require("Mã nhân viên") }),
    experience: z.nativeEnum(EServiceEmployeeExperience, {
        message: ZOD_MESSAGE.invalidEnum("Kinh nghiệm"),
    }),
});

export const updateServiceStepSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: ZOD_MESSAGE.require("Tên bước") }),
    description: z
        .string()
        .min(1, { message: ZOD_MESSAGE.require("Mô tả dịch vụ") }),
    step: z.coerce
        .number({ message: ZOD_MESSAGE.number("Số bước") })
        .int({ message: ZOD_MESSAGE.int("Số bước") })
        .positive({ message: ZOD_MESSAGE.positive("Số bước") }),
    thumbnailId: z.string().optional(),
    thumbnailUrl: z.string().optional(),
});

export const updateServiceSchema = z.object({
    base: updateServiceBaseSchema,
    employees: z.array(updateServiceEmployeeSchema),
    steps: z.array(updateServiceStepSchema),
});
