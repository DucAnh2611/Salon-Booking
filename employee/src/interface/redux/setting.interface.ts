import { ISetting } from "../api/setting.interface";
import { IBaseInitialState } from "./base.interface";

export interface IInitialStateSetting extends IBaseInitialState {
    setting: ISetting | null;
    isUpdating: boolean;
    isReseting: boolean;
}

export interface IActionDedicateSetting {
    setting?: ISetting | null;
}
