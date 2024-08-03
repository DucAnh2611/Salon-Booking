import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { format } from "date-fns";
import { z } from "zod";

export const createShiftSchema = z
    .object({
        workingHourId: z.string(),
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
        bookingStart: z
            .string()
            .refine(
                (time) => /^(0?\d|1\d|2[0-3]):([0-5]\d|[0-5]?\d)$/.test(time),
                {
                    message: ZOD_MESSAGE.date("Thời gian booking bắt đầu"),
                }
            ),
        bookingEnd: z
            .string()
            .refine(
                (time) => /^(0?\d|1\d|2[0-3]):([0-5]\d|[0-5]?\d)$/.test(time),
                {
                    message: ZOD_MESSAGE.date("Thời gian booking kết thúc"),
                }
            ),
    })
    .superRefine((data, ctx: z.RefinementCtx) => {
        const dateTimeFrom = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.start}`
        );
        const dateTimeEnd = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.end}`
        );

        if (dateTimeEnd <= dateTimeFrom) {
            ctx.addIssue({
                message:
                    "Thời gian kết thúc phải lớn hơn hoặc bằng thời gian bắt đầu.",
                path: ["end"],
                code: "unrecognized_keys",
                keys: [],
            });
        }
    })
    .superRefine((data, ctx: z.RefinementCtx) => {
        const dateTimeFrom = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.bookingStart}`
        );
        const dateTimeEnd = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.bookingEnd}`
        );

        if (dateTimeEnd <= dateTimeFrom) {
            ctx.addIssue({
                message:
                    "Thời gian kết thúc đặt lịch phải lớn hơn hoặc bằng ngày thời gian bắt đầu đặt địch.",
                path: ["bookingEnd"],
                code: "unrecognized_keys",
                keys: [],
            });
        }
    })
    .superRefine((data, ctx: z.RefinementCtx) => {
        const dateTimeBookingFrom = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.bookingStart}`
        );
        const dateTimeBookingEnd = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.bookingEnd}`
        );
        const dateTimeFrom = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.start}`
        );
        const dateTimeEnd = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.end}`
        );

        if (
            dateTimeBookingFrom < dateTimeFrom ||
            dateTimeBookingEnd > dateTimeEnd
        ) {
            ctx.addIssue({
                message:
                    "Thời gian đặt lịch phải nằm trong thời gian làm việc của ca làm.",
                path: ["bookingStart"],
                code: "unrecognized_keys",
                keys: [],
            });
            ctx.addIssue({
                message:
                    "Thời gian đặt lịch phải nằm trong thời gian làm việc của ca làm.",
                path: ["bookingEnd"],
                code: "unrecognized_keys",
                keys: [],
            });
        }
    });

export const updateShiftSchema = z
    .object({
        shiftId: z.string(),
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
        bookingStart: z
            .string()
            .refine(
                (time) => /^(0?\d|1\d|2[0-3]):([0-5]\d|[0-5]?\d)$/.test(time),
                {
                    message: ZOD_MESSAGE.date("Thời gian booking bắt đầu"),
                }
            ),
        bookingEnd: z
            .string()
            .refine(
                (time) => /^(0?\d|1\d|2[0-3]):([0-5]\d|[0-5]?\d)$/.test(time),
                {
                    message: ZOD_MESSAGE.date("Thời gian booking kết thúc"),
                }
            ),
    })
    .superRefine((data, ctx: z.RefinementCtx) => {
        const dateTimeFrom = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.start}`
        );
        const dateTimeEnd = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.end}`
        );

        if (dateTimeEnd <= dateTimeFrom) {
            ctx.addIssue({
                message:
                    "Thời gian kết thúc phải lớn hơn hoặc bằng thời gian bắt đầu.",
                path: ["end"],
                code: "unrecognized_keys",
                keys: [],
            });
        }
    })
    .superRefine((data, ctx: z.RefinementCtx) => {
        const dateTimeFrom = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.bookingStart}`
        );
        const dateTimeEnd = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.bookingEnd}`
        );

        if (dateTimeEnd <= dateTimeFrom) {
            ctx.addIssue({
                message:
                    "Thời gian kết thúc đặt lịch phải lớn hơn hoặc bằng ngày thời gian bắt đầu đặt địch.",
                path: ["bookingEnd"],
                code: "unrecognized_keys",
                keys: [],
            });
        }
    })
    .superRefine((data, ctx: z.RefinementCtx) => {
        const dateTimeBookingFrom = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.bookingStart}`
        );
        const dateTimeBookingEnd = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.bookingEnd}`
        );
        const dateTimeFrom = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.start}`
        );
        const dateTimeEnd = new Date(
            `${format(new Date(), "yyyy/MM/dd")} ${data.end}`
        );

        if (
            dateTimeBookingFrom < dateTimeFrom ||
            dateTimeBookingEnd > dateTimeEnd
        ) {
            ctx.addIssue({
                message:
                    "Thời gian đặt lịch phải nằm trong thời gian làm việc của ca làm.",
                path: ["bookingStart"],
                code: "unrecognized_keys",
                keys: [],
            });
            ctx.addIssue({
                message:
                    "Thời gian đặt lịch phải nằm trong thời gian làm việc của ca làm.",
                path: ["bookingEnd"],
                code: "unrecognized_keys",
                keys: [],
            });
        }
    });
