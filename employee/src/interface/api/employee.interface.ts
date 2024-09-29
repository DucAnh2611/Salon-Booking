import { EGender } from "@/enum/gender.enum";
import { EShiftEmployeeStatus } from "@/enum/shift.enum";
import { EUserType } from "@/enum/user.enum";
import { IMedia } from "./media.interface";
import { IRole } from "./role.interface";

export interface IEmployee {
    id: string;
    username: string;
    eRole: IRole | null;
    createdAt: Date;
    updatedAt: Date;
    userBase: IUser;
}

export interface IEmployeeModify {
    id: string;
    username: string;
    userBase: IUser;
}

export interface IUser {
    id: string;
    birthday: Date;
    gender: EGender;
    phone: string;
    firstname: string;
    lastname: string;
    type: EUserType;
    avatar: string | null;
    userAvatar: IUserAvatar | null;
}

export interface IUserEmployee extends IUser {
    eRole: IRole;
    employee: IEmployee;
    userBase: IUser;
}

export interface IUserAvatar extends IMedia {}

export interface IFindEmployee {
    page: number;
    limit: number;
    count: number;
    items: IEmployee[];
}

export interface ICreateEmployee {
    phone: string;
    firstname: string;
    lastname: string;

    eRoleId: string;
    username: string;
    password: string;

    birthday?: Date;
    gender?: EGender;
    userAvatar: IUserAvatar | null;
}

export interface IEmployeeDetail {
    id: string;
    username: string;
    eRole: IRole | null;
    eRoleId: string | null;
    gender: EGender;
    createdAt: Date;
    updatedAt: Date;
    userBase: IUser;
    userCreate: IUserEmployee;
    userUpdate: IUserEmployee;
}

export interface IEmployeeShift {
    shiftId: string;
    employeeId: string;
    employee: IEmployee;
    status: EShiftEmployeeStatus;
}
