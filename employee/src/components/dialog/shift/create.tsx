import RequireField from "@/components/require-field";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createShiftApi } from "@/lib/redux/actions/shift.action";
import { useAppDispatch } from "@/lib/redux/store";
import { createShiftSchema } from "@/schemas/shift.schemas";
import { parseHHMMToTime } from "@/utils/date.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface IDialogCreateShiftProps {
    workingHourId: string;
}

type TDateRange = "start" | "end";

export default function DialogCreateShift({
    workingHourId,
}: IDialogCreateShiftProps) {
    const dispatch = useAppDispatch();

    const [open, SetOpen] = useState<boolean>(false);
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

    const reset = () => {
        SetSelectTime({
            start: "00:00",
            end: "00:00",
        });
        SetSelectBookingTime({
            start: "00:00",
            end: "00:00",
        });
        form.clearErrors();
    };

    const mapTimeBookingForm = (
        from: string,
        to: string,
        form: UseFormReturn<z.infer<typeof createShiftSchema>>
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
        form: UseFormReturn<z.infer<typeof createShiftSchema>>
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

            SetSelectBookingTime(newSelectTime);
        };

    const handleOpen = () => {
        SetOpen((o) => !o);
        reset();
    };

    const handleSubmit = () => {
        const payload = form.getValues();

        dispatch(createShiftApi(payload));
    };

    const form = useForm<z.infer<typeof createShiftSchema>>({
        defaultValues: {
            workingHourId,
            start: "00:00",
            end: "00:00",
            bookingStart: "00:00",
            bookingEnd: "00:00",
        },
        resolver: zodResolver(createShiftSchema),
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

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger asChild>
                <Button
                    className="gap-1"
                    variant="secondary"
                    onClick={handleOpen}
                >
                    <PlusIcon size={15} /> Thêm ca mới
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thêm ca làm mới</DialogTitle>
                    <DialogDescription>
                        Thêm ca làm mới cho ngày làm việc
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <div className="grid grid-cols-1 gap-5">
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
                                <Separator orientation="horizontal" />
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

                                <DialogFooter className="gap-2">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={handleOpen}
                                    >
                                        Hủy
                                    </Button>
                                    <Button variant="default" type="submit">
                                        Tạo ca mới
                                    </Button>
                                </DialogFooter>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
