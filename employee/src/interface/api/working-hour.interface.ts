import { IUserEmployee } from "./employee.interface";
import { IShift } from "./shift.interface";

export interface IWorkingHour {
    id: string;
    date: Date;
    start?: Date;
    end?: Date;
    isOff: boolean;
    shifts: IShift[];
    createdAt: Date;
    updatedAt: Date;
    userCreate: IUserEmployee;
    userUpdate: IUserEmployee;
}

export interface IRangeWorkingHour {
    count: number;
    items: Array<IWorkingHour | null>;
}

export interface IWorkingHourDetail {
    id: string;
    date: Date;
    start?: Date;
    end?: Date;
    isOff: boolean;
    shifts: IShift[];
    createdAt: Date;
    updatedAt: Date;
    userCreate: IUserEmployee;
    userUpdate: IUserEmployee;
}

export interface ICreateWorkingHour {
    dateFrom: string;
    dateEnd: string;
    start: string;
    end: string;
    isOff: boolean;
}

export interface IUpdateWorkingHour {
    id: string;
    start: string;
    end: string;
}
