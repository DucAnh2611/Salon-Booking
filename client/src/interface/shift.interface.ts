export interface IShift {
    id: string;
    bookingEnd: Date;
    bookingStart: Date;
    start: Date;
    end: Date;

    workingHourId: string;
}
export interface IApiShiftBookingTime {
    bookingDate: Date;
}

export interface IApiShiftEmployeeBooking {
    serviceId: string;
    workingHourId: string;
    bookingTime: string;
}

export interface IApiCheckOverlapServiceEmployee {
    services: Array<IApiCheckOverlapServiceEmployeeItem>;
    employeeId: string;
}

export interface IApiCheckOverlapServiceEmployeeItem {
    serviceId: string | null;
    bookingTime: Date | null;
    shiftId: string;
}
