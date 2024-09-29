import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { z } from "zod";

export const updateRoleSchema = z.object({
    title: z
        .string()
        .min(2, { message: ZOD_MESSAGE.min(2, "Tên chức vụ") })
        .max(20, { message: ZOD_MESSAGE.max(20, "Tên chức vụ") }),
    parentId: z.string().optional(),
});
