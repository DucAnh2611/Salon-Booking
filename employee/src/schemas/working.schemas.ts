import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { z } from "zod";

export const createWorkingSchema = z
    .object({
        dateFrom: z.string().refine(
            (date) => {
                return !isNaN(Date.parse(date));
            },
            {
                message: ZOD_MESSAGE.date("Ngày bắt đầu"),
            }
        ),
        dateEnd: z.string().refine(
            (date) => {
                return !isNaN(Date.parse(date));
            },
            {
                message: ZOD_MESSAGE.date("Ngày kết thúc"),
            }
        ),
        start: z
            .string()
            .refine(
                (time) => /^(0?\d|1\d|2[0-3]):([0-5]\d|[0-5]?\d)$/.test(time),
                {
                    message: ZOD_MESSAGE.date("Thời gian bắt đầu"),
                }
            ),
        end: z
            .string()
            .refine(
                (time) => /^(0?\d|1\d|2[0-3]):([0-5]\d|[0-5]?\d)$/.test(time),
                {
                    message: ZOD_MESSAGE.date("Thời gian kết thúc"),
                }
            ),
        isOff: z.boolean().default(false),
    })
    .superRefine(({ dateEnd, dateFrom, end, start }, ctx: z.RefinementCtx) => {
        const dateTimeFrom = new Date(`${dateFrom} ${start}`);
        const dateTimeEnd = new Date(`${dateEnd} ${end}`);

        if (dateTimeFrom < new Date()) {
            ctx.addIssue({
                message:
                    "Ngày bắt đầu và thời gian bắt đầu phải lớn hơn thời điểm hiện tại.",
                path: ["dateFrom"],
                code: "unrecognized_keys",
                keys: [],
            });
            ctx.addIssue({
                message:
                    "Ngày bắt đầu và thời gian bắt đầu phải lớn hơn thời điểm hiện tại.",
                path: ["start"],
                code: "unrecognized_keys",
                keys: [],
            });
        }
    })
    .superRefine((data, ctx: z.RefinementCtx) => {
        const dateTimeFrom = new Date(`${data.dateFrom} ${data.start}`);
        const dateTimeEnd = new Date(`${data.dateEnd} ${data.end}`);

        if (dateTimeEnd <= dateTimeFrom) {
            ctx.addIssue({
                message:
                    "Ngày kết thúc và thời gian kết thúc phải lớn hơn hoặc bằng ngày bắt đầu và thời gian bắt đầu.",
                path: ["dateEnd"],
                code: "unrecognized_keys",
                keys: [],
            });
            ctx.addIssue({
                message:
                    "Ngày kết thúc và thời gian kết thúc phải lớn hơn hoặc bằng ngày bắt đầu và thời gian bắt đầu.",
                path: ["end"],
                code: "unrecognized_keys",
                keys: [],
            });
        }
    });
export const updateWorkingSchema = z
    .object({
        id: z.string(),
        dateFrom: z.string().refine(
            (date) => {
                return !isNaN(Date.parse(date));
            },
            {
                message: ZOD_MESSAGE.date("Ngày bắt đầu"),
            }
        ),
        dateEnd: z.string().refine(
            (date) => {
                return !isNaN(Date.parse(date));
            },
            {
                message: ZOD_MESSAGE.date("Ngày kết thúc"),
            }
        ),
        start: z
            .string()
            .refine(
                (time) => /^(0?\d|1\d|2[0-3]):([0-5]\d|[0-5]?\d)$/.test(time),
                {
                    message: ZOD_MESSAGE.date("Thời gian bắt đầu"),
                }
            ),
        end: z
            .string()
            .refine(
                (time) => /^(0?\d|1\d|2[0-3]):([0-5]\d|[0-5]?\d)$/.test(time),
                {
                    message: ZOD_MESSAGE.date("Thời gian kết thúc"),
                }
            ),
        isOff: z.boolean().default(false),
    })
    .superRefine(({ dateEnd, dateFrom, end, start }, ctx: z.RefinementCtx) => {
        const dateTimeFrom = new Date(`${dateFrom} ${start}`);
        const dateTimeEnd = new Date(`${dateEnd} ${end}`);

        if (dateTimeFrom < new Date()) {
            ctx.addIssue({
                message:
                    "Ngày bắt đầu và thời gian bắt đầu phải lớn hơn thời điểm hiện tại.",
                path: ["dateFrom"],
                code: "unrecognized_keys",
                keys: [],
            });
            ctx.addIssue({
                message:
                    "Ngày bắt đầu và thời gian bắt đầu phải lớn hơn thời điểm hiện tại.",
                path: ["start"],
                code: "unrecognized_keys",
                keys: [],
            });
        }
    })
    .superRefine((data, ctx: z.RefinementCtx) => {
        const dateTimeFrom = new Date(`${data.dateFrom} ${data.start}`);
        const dateTimeEnd = new Date(`${data.dateEnd} ${data.end}`);

        if (dateTimeEnd <= dateTimeFrom) {
            ctx.addIssue({
                message:
                    "Ngày kết thúc và thời gian kết thúc phải lớn hơn hoặc bằng ngày bắt đầu và thời gian bắt đầu.",
                path: ["dateEnd"],
                code: "unrecognized_keys",
                keys: [],
            });
            ctx.addIssue({
                message:
                    "Ngày kết thúc và thời gian kết thúc phải lớn hơn hoặc bằng ngày bắt đầu và thời gian bắt đầu.",
                path: ["end"],
                code: "unrecognized_keys",
                keys: [],
            });
        }
    });
