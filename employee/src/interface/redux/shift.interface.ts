import { IShiftDetail } from "../api/shift.interface";
import { ICRUDInitialState } from "./base.interface";

export interface IInitialStateShift extends ICRUDInitialState {
    detail: IShiftDetail | null;
    reload: boolean;
}

export interface IActionDedicateShift {
    detail?: IShiftDetail | null;
    reload?: boolean;
}
