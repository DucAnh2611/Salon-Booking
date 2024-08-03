import RequireField from "@/components/require-field";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cn } from "@/lib";
import { createWorkingHourApi } from "@/lib/redux/actions/working-hour.action";
import { workingHourSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { createWorkingSchema } from "@/schemas/working.schemas";
import { parseHHMMToTime } from "@/utils/date.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { PlusIcon } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

type TDateRange = "from" | "to";

export default function DialogCreateWorkingDay() {
    const dispatch = useAppDispatch();
    const { isCreating, isFailure } = useAppSelector(workingHourSelector);

    const [open, SetOpen] = useState<boolean>(false);
    const [isRange, SetIsRange] = useState<boolean>(false);
    const [submit, SetSubmit] = useState<boolean>(false);
    const [selectDate, SetSelectDate] = useState<Record<TDateRange, Date>>({
        from: new Date(),
        to: new Date(),
    });
    const [selectTime, SetSelectTime] = useState<Record<TDateRange, string>>({
        from: "00:00",
        to: "00:00",
    });

    const reset = () => {
        SetIsRange(false);
        SetSelectDate({
            from: new Date(),
            to: new Date(),
        });
        SetSelectTime({
            from: "00:00",
            to: "00:00",
        });
        form.clearErrors();
    };

    const mapTimeForm = (
        from: string,
        to: string,
        form: UseFormReturn<z.infer<typeof createWorkingSchema>>
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

    const mapDateForm = (
        from: Date,
        to: Date,
        form: UseFormReturn<z.infer<typeof createWorkingSchema>>
    ) => {
        form.setValue("dateFrom", format(from, "yyyy/MM/dd"));
        form.setValue("dateEnd", format(to, "yyyy/MM/dd"));
    };

    const toggleIsRange = () => {
        const newRange = !isRange;

        SetIsRange(newRange);
        SetSelectDate({
            ...selectDate,
            to: selectDate.from,
        });
    };

    const toggleOpen = () => {
        SetOpen((o) => !o);
        reset();
    };

    const handleChangeDate = (type: TDateRange) => (day: Date | undefined) => {
        let newDay = day || new Date();

        const newSelecteDate: Record<TDateRange, Date> = {
            ...selectDate,
        };

        if (day) {
            newDay = day.getTime() < Date.now() ? new Date() : day;
        }

        if (
            type === "from" &&
            day &&
            newSelecteDate.to.getTime() < day.getTime()
        ) {
            newSelecteDate.to = newDay;
        }
        newSelecteDate[type] = newDay;

        if (
            newSelecteDate.from.getTime() > newSelecteDate.to.getTime() ||
            !isRange
        ) {
            newSelecteDate.to = newSelecteDate.from;
        }

        SetSelectDate(newSelecteDate);
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

            if (type === "from") {
                const { hours: hourFrom, minutes: minuteFrom } =
                    parseHHMMToTime(formatDate);
                const { hours: hourTo, minutes: minuteTo } = parseHHMMToTime(
                    selectTime.to
                );
                console.log(
                    hourTo * 60 + minuteTo,
                    hourFrom * 60 + minuteFrom,
                    formatDate
                );
                if (hourTo * 60 + minuteTo < hourFrom * 60 + minuteFrom) {
                    newSelectTime.to = formatDate;
                }
            }

            SetSelectTime(newSelectTime);
        };

    const handleSubmit = () => {
        const payload = form.getValues();
        SetSubmit(true);
        dispatch(createWorkingHourApi(payload));
    };

    const form = useForm<z.infer<typeof createWorkingSchema>>({
        defaultValues: {
            dateFrom: format(new Date(), "yyyy/MM/dd"),
            dateEnd: format(new Date(), "yyyy/MM/dd"),
            start: "00:00",
            end: "00:00",
            isOff: false,
        },
        resolver: zodResolver(createWorkingSchema),
    });

    useMemo(() => {
        mapDateForm(selectDate.from, selectDate.to, form);
    }, [selectDate]);

    useMemo(() => {
        mapTimeForm(selectTime.from, selectTime.to, form);
    }, [selectTime]);

    useEffect(() => {
        if (submit && !isCreating && !isFailure) {
            SetSubmit(false);
            SetOpen(false);
            reset();
        }
    }, [submit, isCreating, isFailure]);

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger asChild>
                <Button className="gap-1" onClick={toggleOpen}>
                    <PlusIcon size={14} />
                    <p className="font-normal">Tạo mới</p>
                </Button>
            </DialogTrigger>
            <DialogContent className="w-fit max-w-none">
                <DialogHeader>
                    <DialogTitle>Tạo ngày làm việc</DialogTitle>
                    <DialogDescription>
                        Có thể tạo mới nhiều ngày làm việc.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <div className="w-fit flex flex-col gap-2">
                                <div className="flex gap-2 just">
                                    <FormField
                                        control={form.control}
                                        name="dateFrom"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>
                                                    Ngày
                                                    <RequireField />
                                                </FormLabel>
                                                <FormControl>
                                                    <Calendar
                                                        locale={vi}
                                                        mode="single"
                                                        selected={
                                                            selectDate.from
                                                        }
                                                        onSelect={handleChangeDate(
                                                            "from"
                                                        )}
                                                        fromDate={new Date()}
                                                        className="rounded-md border w-fit"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {isRange && (
                                        <FormField
                                            control={form.control}
                                            name="dateEnd"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel>
                                                        Tới ngày
                                                        <RequireField />
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Calendar
                                                            locale={vi}
                                                            mode="single"
                                                            selected={
                                                                selectDate.to
                                                            }
                                                            onSelect={handleChangeDate(
                                                                "to"
                                                            )}
                                                            fromDate={
                                                                selectDate.from
                                                            }
                                                            className="rounded-md border w-fit"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="mutiple"
                                        onClick={toggleIsRange}
                                    />
                                    <label
                                        htmlFor="mutiple"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Đặt cho nhiều ngày
                                    </label>
                                </div>

                                <div
                                    className={cn(
                                        "flex gap-2",
                                        isRange ? "flex-row" : "flex-col"
                                    )}
                                >
                                    <FormField
                                        control={form.control}
                                        name="start"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>
                                                    Giờ bắt đầu
                                                    <RequireField />
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex gap-1 items-center">
                                                        <div className="flex gap-1 flex-1">
                                                            <Input
                                                                placeholder="Giờ"
                                                                type="number"
                                                                value={
                                                                    selectTime.from.split(
                                                                        ":"
                                                                    )[0]
                                                                }
                                                                onChange={handleChangeTime(
                                                                    "from",
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
                                                                    selectTime.from.split(
                                                                        ":"
                                                                    )[1]
                                                                }
                                                                onChange={handleChangeTime(
                                                                    "from",
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
                                                    Giờ kết thúc
                                                    <RequireField />
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex gap-1 items-center">
                                                        <div className="flex gap-1 flex-1">
                                                            <Input
                                                                placeholder="Giờ"
                                                                type="number"
                                                                value={
                                                                    selectTime.to.split(
                                                                        ":"
                                                                    )[0]
                                                                }
                                                                onChange={handleChangeTime(
                                                                    "to",
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
                                                                    selectTime.to.split(
                                                                        ":"
                                                                    )[1]
                                                                }
                                                                onChange={handleChangeTime(
                                                                    "to",
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

                                <DialogFooter className="mt-3">
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={toggleOpen}
                                    >
                                        Hủy
                                    </Button>
                                    <Button variant="default" type="submit">
                                        Tạo
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
