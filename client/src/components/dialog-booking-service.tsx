"use client";

import useBooking from "@/hook/useBooking.hook";
import useDebounce from "@/hook/useDebounce.hook";
import { IEmployeeShift } from "@/interface/employee.interface";
import { IServiceItemCartBooking } from "@/interface/service.interface";
import { IApiShiftEmployeeBooking, IShift } from "@/interface/shift.interface";
import { IWorkingHourBooking } from "@/interface/working-hour.interface";
import {
    getShiftBookingTime,
    getShiftEmployeeBooking,
} from "@/lib/actions/shift.action";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ReactNode, useEffect, useState } from "react";
import DatePicker from "./date-picker";
import RequireField from "./required-field";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";

interface IDialogBookingServiceProps {
    trigger: ReactNode;
    onConfirm: (item: IServiceItemCartBooking) => void;
    serviceItem: IServiceItemCartBooking;
}

export default function DialogBookingService({
    trigger,
    onConfirm,
    serviceItem,
}: IDialogBookingServiceProps) {
    const {
        bookingDate,
        bookingShift,
        bookingEmployee,
        setBookingDate,
        setBookingShift,
        setEmployee,
    } = useBooking();

    const [workingHour, SetWorkingHour] = useState<
        IWorkingHourBooking | undefined
    >();
    const [shiftEmployee, SetShiftEmployee] = useState<IEmployeeShift[]>([]);
    const [loading, SetLoading] = useState<boolean>(false);
    const [open, SetOpen] = useState<boolean>(false);
    const [timeSlot, SetTimeSlot] = useState<Date[]>([]);
    const [selectDate, SetSelectDate] = useState<Date | undefined>();
    const [selectTime, SetSelectTime] = useState<Date | undefined>();
    const {
        debouncedValue: bookingTimeDebounced,
        isDebouncing: isDebouncingBookingTime,
    } = useDebounce<Date | undefined>(selectTime);
    const {
        debouncedValue: bookingDateDebounced,
        isDebouncing: isDebouncingBookingDate,
    } = useDebounce<Date | undefined>(selectDate);

    const getShiftBookingDate = async (date: Date) => {
        SetShiftEmployee([]);
        SetTimeSlot([]);

        setBookingShift(undefined);
        setEmployee(undefined);
        SetLoading(true);

        const { response } = await getShiftBookingTime({ bookingDate: date });

        if (response) {
            SetWorkingHour(response.result);
        } else {
            SetWorkingHour(undefined);
            toast({
                title: "Thất bại",
                description: "Lấy dữ liệu ca làm không thành công",
                variant: "destructive",
                duration: 1000,
            });
        }

        SetLoading(false);
    };

    const getShiftEmployee = async (body: IApiShiftEmployeeBooking) => {
        SetLoading(true);
        const { response } = await getShiftEmployeeBooking(body);

        if (response) {
            SetShiftEmployee(response.result);
        } else {
            toast({
                title: "Thất bại",
                description: "Lấy dữ liệu nhân viên không thành công",
                variant: "destructive",
                duration: 1000,
            });
        }

        SetLoading(false);
    };

    const handleSelectDate = (date: Date | null) => {
        SetSelectDate(date || undefined);
    };

    const handleSelectShift = (shift: IShift) => () => {
        if (bookingShift && bookingShift.id === shift.id) {
            setBookingShift();
        } else {
            setBookingShift(shift);
        }
    };

    const handleSelectBookingTime = (time: Date) => () => {
        SetSelectTime(time);
    };

    const handleSelectEmployee = (employee: IEmployeeShift) => () => {
        setEmployee(
            bookingEmployee &&
                bookingEmployee.employeeId === employee.employeeId
                ? undefined
                : employee
        );
    };

    const handleOpen = (open: boolean) => {
        if (open) {
            SetWorkingHour(undefined);
            SetShiftEmployee([]);
            SetTimeSlot([]);
            SetSelectDate(undefined);
            SetSelectTime(undefined);

            setEmployee(undefined);
            setBookingShift(undefined);
            setBookingDate(undefined);
        }
        SetOpen(open);
    };

    const timeInvalidCurrent = (time: Date) => {
        return time <= new Date();
    };

    const getTimeSlots = (shift: IShift) => {
        const slots = [];

        let startTime = new Date(shift.bookingStart);
        const endTime = new Date(shift.bookingEnd);

        const minutes = startTime.getMinutes();
        const roundedMinutes = Math.ceil(minutes / 15) * 15;
        startTime.setMinutes(roundedMinutes);
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);

        while (startTime <= endTime) {
            slots.push(new Date(startTime));
            startTime.setMinutes(startTime.getMinutes() + 15);
        }

        return slots;
    };

    const handleConfirm = () => {
        if (bookingDate && bookingEmployee && bookingEmployee && bookingShift) {
            onConfirm({
                ...serviceItem,
                bookingTime: bookingDate,
                employee: bookingEmployee,
                shift: bookingShift,
            });
            SetOpen(false);
        }
    };

    useEffect(() => {
        if (
            bookingDateDebounced &&
            ((bookingDate && bookingDateDebounced !== bookingDate) ||
                !bookingDate)
        ) {
            getShiftBookingDate(bookingDateDebounced);
        } else {
            SetWorkingHour(undefined);
            SetShiftEmployee([]);
            SetTimeSlot([]);

            setBookingShift(undefined);
            setEmployee(undefined);
        }
    }, [bookingDateDebounced]);

    useEffect(() => {
        if (bookingTimeDebounced && bookingShift && workingHour) {
            setBookingDate(bookingTimeDebounced);

            getShiftEmployee({
                bookingTime: format(
                    bookingTimeDebounced,
                    "yyyy/MM/dd HH:mm:ss"
                ),
                serviceId: serviceItem.serviceId,
                workingHourId: workingHour.id,
            });
        } else {
            SetWorkingHour(undefined);
        }
    }, [bookingTimeDebounced]);

    useEffect(() => {
        if (bookingShift) {
            const timeSlot = getTimeSlots(bookingShift);
            SetTimeSlot(timeSlot);
        } else {
            SetTimeSlot([]);
        }
    }, [bookingShift]);

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thời gian và nhân viên phục vụ</DialogTitle>
                    <DialogDescription>
                        Chọn thời gian và nhân viên phục vụ, nếu trong thời gian
                        bạn chọn không có nhân viên nào, vui lòng thử lại ở thời
                        gian khác
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col w-full gap-2">
                    <div className="">
                        <Label>
                            Ngày
                            <RequireField />
                        </Label>
                        <div>
                            <DatePicker
                                value={bookingDate}
                                onChange={handleSelectDate}
                                trigger={
                                    <Button
                                        className="w-full text-left justify-start"
                                        variant="outline"
                                        type="button"
                                    >
                                        {bookingDate
                                            ? format(bookingDate, "yyyy/MM/dd")
                                            : "Ngày sử dụng dịch vụ"}
                                    </Button>
                                }
                                fromDate={new Date()}
                            />
                        </div>
                    </div>
                    {bookingDate && workingHour && !workingHour.available && (
                        <div>
                            <p>
                                {format(bookingDate, "yyyy/MM/dd")} Không khả
                                dụng
                            </p>
                        </div>
                    )}
                    {workingHour && workingHour.isOff && (
                        <div>
                            <p>
                                {format(workingHour.date, "yyyy/MM/dd")} là ngày
                                nghỉ
                            </p>
                        </div>
                    )}
                    {workingHour &&
                        workingHour.available &&
                        !workingHour.isOff && (
                            <div className="">
                                <Label>
                                    Ca làm
                                    <RequireField />
                                </Label>
                                <div>
                                    {!workingHour.shifts.length && !loading && (
                                        <div>
                                            <p>
                                                Ngày{" "}
                                                {format(
                                                    workingHour.date,
                                                    "yyyy/MM/dd"
                                                )}{" "}
                                                không có ca làm nào
                                            </p>
                                        </div>
                                    )}
                                    {!!workingHour.shifts.length && (
                                        <div className="flex w-full overflow-x-auto gap-2">
                                            {workingHour.shifts.map((shift) => (
                                                <div key={shift.id}>
                                                    <Button
                                                        variant={
                                                            bookingShift &&
                                                            bookingShift.id ===
                                                                shift.id
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        onClick={handleSelectShift(
                                                            shift
                                                        )}
                                                        type="button"
                                                    >
                                                        {format(
                                                            shift.start,
                                                            "HH:mm"
                                                        )}{" "}
                                                        -{" "}
                                                        {format(
                                                            shift.end,
                                                            "HH:mm"
                                                        )}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    {bookingShift && (
                        <div>
                            <Label>
                                Khung giờ
                                <RequireField />
                            </Label>
                            <div className="w-full overflow-hidden overflow-x-auto">
                                <div className="grid grid-flow-col grid-rows-3 w-fit gap-2">
                                    {timeSlot.map((slot) => (
                                        <div key={slot.getTime()}>
                                            <Button
                                                variant={
                                                    selectTime &&
                                                    selectTime === slot
                                                        ? "default"
                                                        : "outline"
                                                }
                                                onClick={handleSelectBookingTime(
                                                    slot
                                                )}
                                                type="button"
                                                disabled={
                                                    format(
                                                        slot,
                                                        "yyyy/MM/dd"
                                                    ) ===
                                                        format(
                                                            new Date(),
                                                            "yyyy/MM/dd"
                                                        ) &&
                                                    timeInvalidCurrent(slot)
                                                }
                                            >
                                                {format(slot, "HH:mm")}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {!!shiftEmployee.length && (
                        <div>
                            <Label>
                                Nhân viên
                                <RequireField />
                            </Label>
                            <div className="w-full flex gap-2 overflow-x-auto">
                                {shiftEmployee.map((emp) => (
                                    <div
                                        className="h-[200px] w-[120px] overflow-hidden cursor-pointer"
                                        key={emp.employeeId + emp.shiftId}
                                        onClick={handleSelectEmployee(emp)}
                                    >
                                        <Card
                                            className={cn(
                                                "w-full h-full",
                                                bookingEmployee &&
                                                    bookingEmployee.employeeId ===
                                                        emp.employeeId &&
                                                    "border-primary"
                                            )}
                                        >
                                            <p>
                                                {
                                                    emp.employee.userBase
                                                        .firstname
                                                }
                                                {emp.employee.userBase.lastname}
                                            </p>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <div className="flex w-full justify-end gap-2">
                        <Button
                            onClick={() => {
                                handleOpen(false);
                            }}
                            variant="outline"
                            type="button"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={
                                !(
                                    bookingDate &&
                                    bookingEmployee &&
                                    bookingEmployee &&
                                    bookingShift
                                )
                            }
                            type="button"
                        >
                            Xác nhận
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
