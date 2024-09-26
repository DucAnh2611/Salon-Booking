"use client";

import { IEmployeeShift } from "@/interface/employee.interface";
import { ILayoutProps } from "@/interface/layout.interface";
import { IShift } from "@/interface/shift.interface";
import { createContext, useState } from "react";

interface IBookingContext {
    bookingDate?: Date;
    bookingEmployee?: IEmployeeShift;
    bookingShift?: IShift;

    setBookingShift: (shift?: IShift) => void;
    setEmployee: (employee?: IEmployeeShift) => void;
    setBookingDate: (date?: Date) => void;
}

export const BookingContext = createContext<IBookingContext>({
    setBookingShift: (shift?: IShift) => {},
    setEmployee: (employee?: IEmployeeShift) => {},
    setBookingDate: (date?: Date) => {},
});

export default function BookingProvider({ children }: ILayoutProps) {
    const [bookingDate, SetBookingDate] = useState<Date | undefined>();
    const [employee, SetEmployee] = useState<IEmployeeShift | undefined>();
    const [shift, SetShift] = useState<IShift | undefined>();

    const setBookingShift = (shift?: IShift) => {
        SetShift(shift);
    };
    const setEmployee = (employee?: IEmployeeShift) => {
        SetEmployee(employee);
    };
    const setBookingDate = (date?: Date) => {
        SetBookingDate(date);
    };

    return (
        <BookingContext.Provider
            value={{
                bookingDate,
                bookingEmployee: employee,
                bookingShift: shift,
                setBookingDate,
                setBookingShift,
                setEmployee,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
}
