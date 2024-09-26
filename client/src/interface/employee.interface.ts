import { EShiftEmployeeStatus } from "@/enum/shift.enum";
import { IUserBase } from "./user.interface";

export interface IEmployee {
    id: string;
    userBase: IUserBase;
}

export interface IEmployeeShift {
    shiftId: string;

    employeeId: string;
    employee: IEmployee;

    status: EShiftEmployeeStatus;
}
