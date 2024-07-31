import { IService, IServiceDetail } from "../api/service.interface";
import { ICRUDInitialState } from "./base.interface";

export interface IInitialStateService extends ICRUDInitialState {
    services: IService[];
    deleteItems: string[];
    detail: IServiceDetail | null;
    page: number;
    limit: number;
    count: number;
    key: string;
    orderBy: string;
}

export interface IActionDedicateService {
    services?: IService[];
    deleteItems?: string[];
    detail?: IServiceDetail | any;
    page?: number;
    limit?: number;
    count?: number;
    key?: string;
    orderBy?: string;
}
