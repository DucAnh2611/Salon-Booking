import RequireField from "@/components/require-field";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IShiftDetail } from "@/interface/api/shift.interface";
import { updateShiftApi } from "@/lib/redux/actions/shift.action";
import { useAppDispatch } from "@/lib/redux/store";
import { updateShiftSchema } from "@/schemas/shift.schemas";
import { formatTimeToHHMM, parseHHMMToTime } from "@/utils/date.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface IUpdateShiftBaseSectionProps {
    detail: IShiftDetail;
}

type TDateRange = "start" | "end";

export default function UpdateShiftBaseSection({
    detail,
}: IUpdateShiftBaseSectionProps) {
    const dispatch = useAppDispatch();

    const [change, SetChange] = useState<boolean>(false);
    const [selectTime, SetSelectTime] = useState<Record<TDateRange, string>>({
        start: "00:00",
        end: "00:00",
    });
    const [selectBookingTime, SetSelectBookingTime] = useState<
        Record<TDateRange, string>
    >({
        start: "00:00",
        end: "00:00",
    });

    const reset = (detail: IShiftDetail) => {
        SetSelectTime({
            start: formatTimeToHHMM(detail.shift.start),
            end: formatTimeToHHMM(detail.shift.end),
        });
        SetSelectBookingTime({
            start: formatTimeToHHMM(detail.shift.bookingStart),
            end: formatTimeToHHMM(detail.shift.bookingEnd),
        });
        form.clearErrors();
    };

    const mapTimeBookingForm = (
        from: string,
        to: string,
        form: UseFormReturn<z.infer<typeof updateShiftSchema>>
    ) => {
        form.setValue(
            "bookingStart",
            from
                .split(":")
                .map((v) => (v.length < 2 ? `0${v}` : v))
                .join(":")
        );
        form.setValue(
            "bookingEnd",
            to
                .split(":")
                .map((v) => (v.length < 2 ? `0${v}` : v))
                .join(":")
        );
    };

    const mapTimeForm = (
        from: string,
        to: string,
        form: UseFormReturn<z.infer<typeof updateShiftSchema>>
    ) => {
        form.setValue(
            "start",
            from
                .split(":")
                .map((v) => (v.length < 2 ? `0${v}` : v))
                .join(":")
        );
        form.setValue(
            "end",
            to
                .split(":")
                .map((v) => (v.length < 2 ? `0${v}` : v))
                .join(":")
        );
    };

    const handleChangeTime =
        (type: TDateRange, time: "hour" | "minute") =>
        (e: ChangeEvent<HTMLInputElement>) => {
            let value = parseInt(e.target.value) || 0;
            const [hour, minute] = selectTime[type].split(":");

            if (time === "hour") {
                if (value >= 24 || value < 0) {
                    value = 0;
                }
            } else if (time === "minute") {
                if (value >= 60 || value < 0) {
                    value = 0;
                }
            }
            const formatDate =
                time === "hour"
                    ? [value, minute].join(":")
                    : [hour, value].join(":");

            let newSelectTime = {
                ...selectTime,
                [type]: formatDate,
            };

            if (type === "start") {
                const { hours: hourFrom, minutes: minuteFrom } =
                    parseHHMMToTime(formatDate);
                const { hours: hourTo, minutes: minuteTo } = parseHHMMToTime(
                    selectTime.end
                );
                if (hourTo * 60 + minuteTo < hourFrom * 60 + minuteFrom) {
                    newSelectTime.end = formatDate;
                }
            }

            SetChange(true);
            SetSelectTime(newSelectTime);
        };

    const handleChangeBookingTime =
        (type: TDateRange, time: "hour" | "minute") =>
        (e: ChangeEvent<HTMLInputElement>) => {
            let value = parseInt(e.target.value) || 0;
            const [hour, minute] = selectBookingTime[type].split(":");

            if (time === "hour") {
                if (value >= 24 || value < 0) {
                    value = 0;
                }
            } else if (time === "minute") {
                if (value >= 60 || value < 0) {
                    value = 0;
                }
            }
            const formatDate =
                time === "hour"
                    ? [value, minute].join(":")
                    : [hour, value].join(":");

            let newSelectTime = {
                ...selectBookingTime,
                [type]: formatDate,
            };

            if (type === "start") {
                const { hours: hourFrom, minutes: minuteFrom } =
                    parseHHMMToTime(formatDate);
                const { hours: hourTo, minutes: minuteTo } = parseHHMMToTime(
                    selectTime.end
                );
                if (hourTo * 60 + minuteTo < hourFrom * 60 + minuteFrom) {
                    newSelectTime.end = formatDate;
                }
            }

            SetChange(true);
            SetSelectBookingTime(newSelectTime);
        };

    const discardChanges = () => {
        reset(detail);
        SetChange(false);
    };

    const handleSubmit = () => {
        const payload = form.getValues();

        dispatch(updateShiftApi(payload));
    };

    const form = useForm<z.infer<typeof updateShiftSchema>>({
        defaultValues: {
            shiftId: detail.shift.id,
            start: formatTimeToHHMM(detail.shift.start),
            end: formatTimeToHHMM(detail.shift.end),
            bookingStart: formatTimeToHHMM(detail.shift.bookingStart),
            bookingEnd: formatTimeToHHMM(detail.shift.bookingEnd),
        },
        resolver: zodResolver(updateShiftSchema),
    });

    useMemo(() => {
        mapTimeForm(selectTime.start, selectTime.end, form);
    }, [selectTime]);

    useMemo(() => {
        mapTimeBookingForm(
            selectBookingTime.start,
            selectBookingTime.end,
            form
        );
    }, [selectBookingTime]);

    useEffect(() => {
        reset(detail);
    }, [detail]);

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="start"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>
                                            Thời gian ca làm bắt đầu
                                            <RequireField />
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex gap-1 items-center">
                                                <div className="flex gap-1 flex-1">
                                                    <Input
                                                        placeholder="Giờ"
                                                        type="number"
                                                        value={
                                                            selectTime.start.split(
                                                                ":"
                                                            )[0]
                                                        }
                                                        onChange={handleChangeTime(
                                                            "start",
                                                            "hour"
                                                        )}
                                                    />
                                                    <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                                                        <p>Giờ</p>
                                                    </div>
                                                </div>
                                                <span className="text-center">
                                                    :
                                                </span>
                                                <div className="flex gap-1 flex-1">
                                                    <Input
                                                        placeholder="Phút"
                                                        type="number"
                                                        value={
                                                            selectTime.start.split(
                                                                ":"
                                                            )[1]
                                                        }
                                                        onChange={handleChangeTime(
                                                            "start",
                                                            "minute"
                                                        )}
                                                    />
                                                    <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                                                        <p>Phút</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="end"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>
                                            Thời gian ca làm kết thúc
                                            <RequireField />
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex gap-1 items-center">
                                                <div className="flex gap-1 flex-1">
                                                    <Input
                                                        placeholder="Giờ"
                                                        type="number"
                                                        value={
                                                            selectTime.end.split(
                                                                ":"
                                                            )[0]
                                                        }
                                                        onChange={handleChangeTime(
                                                            "end",
                                                            "hour"
                                                        )}
                                                    />
                                                    <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                                                        <p>Giờ</p>
                                                    </div>
                                                </div>
                                                <span className="text-center">
                                                    :
                                                </span>
                                                <div className="flex gap-1 flex-1">
                                                    <Input
                                                        placeholder="Phút"
                                                        type="number"
                                                        value={
                                                            selectTime.end.split(
                                                                ":"
                                                            )[1]
                                                        }
                                                        onChange={handleChangeTime(
                                                            "end",
                                                            "minute"
                                                        )}
                                                    />
                                                    <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                                                        <p>Phút</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="bookingStart"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>
                                            Thời gian đặt lịch bắt đầu
                                            <RequireField />
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex gap-1 items-center">
                                                <div className="flex gap-1 flex-1">
                                                    <Input
                                                        placeholder="Giờ"
                                                        type="number"
                                                        value={
                                                            selectBookingTime.start.split(
                                                                ":"
                                                            )[0]
                                                        }
                                                        onChange={handleChangeBookingTime(
                                                            "start",
                                                            "hour"
                                                        )}
                                                    />
                                                    <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                                                        <p>Giờ</p>
                                                    </div>
                                                </div>
                                                <span className="text-center">
                                                    :
                                                </span>
                                                <div className="flex gap-1 flex-1">
                                                    <Input
                                                        placeholder="Phút"
                                                        type="number"
                                                        value={
                                                            selectBookingTime.start.split(
                                                                ":"
                                                            )[1]
                                                        }
                                                        onChange={handleChangeBookingTime(
                                                            "start",
                                                            "minute"
                                                        )}
                                                    />
                                                    <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                                                        <p>Phút</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bookingEnd"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>
                                            Thời gian đặt lịch kết thúc
                                            <RequireField />
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex gap-1 items-center">
                                                <div className="flex gap-1 flex-1">
                                                    <Input
                                                        placeholder="Giờ"
                                                        type="number"
                                                        value={
                                                            selectBookingTime.end.split(
                                                                ":"
                                                            )[0]
                                                        }
                                                        onChange={handleChangeBookingTime(
                                                            "end",
                                                            "hour"
                                                        )}
                                                    />
                                                    <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                                                        <p>Giờ</p>
                                                    </div>
                                                </div>
                                                <span className="text-center">
                                                    :
                                                </span>
                                                <div className="flex gap-1 flex-1">
                                                    <Input
                                                        placeholder="Phút"
                                                        type="number"
                                                        value={
                                                            selectBookingTime.end.split(
                                                                ":"
                                                            )[1]
                                                        }
                                                        onChange={handleChangeBookingTime(
                                                            "end",
                                                            "minute"
                                                        )}
                                                    />
                                                    <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                                                        <p>Phút</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {change && (
                            <div className="col-span-full flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-destructive text-destructive"
                                    onClick={discardChanges}
                                >
                                    Bỏ thay đổi
                                </Button>
                                <Button type="submit">Sửa giờ làm</Button>
                            </div>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
}
