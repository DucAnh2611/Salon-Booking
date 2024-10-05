import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { z } from "zod";

const vietnamPhoneRegex = /^(03|05|07|08|09)\d{8}$/;

export const createOrganizationSchema = z.object({
    name: z.string().min(1).max(15),
    logoUrl: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().regex(vietnamPhoneRegex, { message: ZOD_MESSAGE.phone }),
    gmail: z.string().email().min(1),

    facebook: z.string().optional(),
    zalo: z.string().optional(),
    instagram: z.string().optional(),
});

export const updateOrganizationSchema = z.object({
    organizationId: z.string().min(1),

    name: z.string().min(1).max(15),
    logoId: z.string().optional(),
    logoUrl: z.string().optional(),
    phone: z.string().regex(vietnamPhoneRegex, { message: ZOD_MESSAGE.phone }),
    address: z.string().min(1),
    gmail: z.string().email().min(1),

    facebook: z.string().optional(),
    zalo: z.string().optional(),
    instagram: z.string().optional(),
});
