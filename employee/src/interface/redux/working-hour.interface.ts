import {
    IWorkingHour,
    IWorkingHourDetail,
} from "../api/working-hour.interface";
import { ICRUDInitialState } from "./base.interface";

export interface IInitialStateWorkingHour extends ICRUDInitialState {
    reload: boolean;
    workingHours: (IWorkingHour | null)[];
    detail: IWorkingHourDetail | null;
    count: number;
}

export interface IActionDedicateWorkingHour {
    reload?: boolean;
    workingHours?: (IWorkingHour | null)[];
    detail?: IWorkingHourDetail | null;
    count?: number;
}
