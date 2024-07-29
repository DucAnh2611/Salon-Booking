import { ZOD_MESSAGE } from "@/constants/zod.constant";
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
