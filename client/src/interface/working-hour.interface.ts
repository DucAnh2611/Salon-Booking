import { IShift } from "./shift.interface";

export interface IWorkingHour {
    id: string;
    start: Date;
    end: Date;
    isOff: boolean;
    available: boolean;
    date: Date;
}

export interface IWorkingHourBooking extends IWorkingHour {
    shifts: IShift[];
}
