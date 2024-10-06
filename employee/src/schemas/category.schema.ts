import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { z } from "zod";

export const createCategorySchema = z.object({
    parentId: z.string().optional(),
    title: z
        .string()
        .min(2, { message: ZOD_MESSAGE.min(2, "Tên danh mục") })
        .max(20, { message: ZOD_MESSAGE.max(20, "Tên danh mục") }),
});

export const updateCategorySchema = z.object({
    parentId: z.string().optional(),
    title: z
        .string()
        .min(2, { message: ZOD_MESSAGE.min(2, "Tên danh mục") })
        .max(20, { message: ZOD_MESSAGE.max(20, "Tên danh mục") }),
});
