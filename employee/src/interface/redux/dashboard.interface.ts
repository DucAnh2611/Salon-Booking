import { IStatisticDashboard } from "../api/dashboard.interface";
import { IBaseInitialState } from "./base.interface";

export interface IInitialStateStatisticDashboard extends IBaseInitialState {
    statistic: IStatisticDashboard | null;
    year: number;
    month: number;
}

export interface IActionDedicateStatisticDashboard {
    statistic: IStatisticDashboard;
    year?: number;
    month?: number;
}
