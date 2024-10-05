import { IJob } from "../api/job.interface";
import { IBaseInitialState } from "./base.interface";

export interface IInitialStateJob extends IBaseInitialState {
    jobs: IJob[];
    page: number;
    limit: number;
    count: number;
    from?: Date;
    to?: Date;
    reload: boolean;
}

export interface IActionDedicateJob {
    jobs?: IJob[];
    page?: number;
    limit?: number;
    count?: number;
    from?: Date;
    to?: Date;
}
