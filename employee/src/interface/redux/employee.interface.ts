import { IEmployee, IEmployeeDetail } from "../api/employee.interface";
import { ICRUDInitialState } from "./base.interface";

export interface IInitialStateEmployee extends ICRUDInitialState {
    page: number;
    limit: number;
    count: number;
    key: string;
    orderBy: string;
    employees: IEmployee[];
    detail: IEmployeeDetail | null;
    deleteItems: string[];
}

export interface IActionDedicateEmployee {
    page?: number;
    limit?: number;
    count?: number;
    key?: string;
    orderBy?: string;
    employees?: IEmployee[];
    detail?: IEmployeeDetail | null;
    deleteItems?: string[];
}

export interface IActionDedicateEmployeeParam {
    page: number;
    limit: number;
    key: string;
    orderBy: string;
}
