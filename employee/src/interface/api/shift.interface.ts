import { EShiftEmployeeStatus } from "@/enum/shift.enum";
import { IEmployeeShift, IUserEmployee } from "./employee.interface";

export interface IShift {
    id: string;
    workingHourId: string;
    start: Date;
    end: Date;
    bookingStart: Date;
    bookingEnd: Date;
}

export interface IShiftDetail {
    shift: {
        id: string;
        workingHourId: string;
        start: Date;
        end: Date;
        bookingStart: Date;
        bookingEnd: Date;
        createdAt: Date;
        updatedAt: Date;
        userCreate: IUserEmployee;
        userUpdate: IUserEmployee;
    };
    employees: IEmployeeShift[];
}

export interface IShiftCreate {
    workingHourId: string;
    start: string;
    end: string;
    bookingStart: string;
    bookingEnd: string;
}

export interface IShiftUpdate {
    shiftId: string;
    start: string;
    end: string;
    bookingStart: string;
    bookingEnd: string;
}

export interface IShiftAssignmentEmployeeId {
    employeeId: string;
    status: EShiftEmployeeStatus;
}

export interface IShiftAssignmentRemove {
    shiftId: string;
    employeeIds: string[];
}

export interface IShiftAssignmentAdd {
    shiftId: string;
    assignments: IShiftAssignmentEmployeeId[];
}
