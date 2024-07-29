import { IRole, IRoleDetail } from "../api/role.interface";
import { ICRUDInitialState } from "./base.interface";

export interface IInitialStateRole extends ICRUDInitialState {
    roles: IRole[];
    deleteItems: string[];
    detail: IRoleDetail | null;
    key: string;
    limit: number;
    orderBy: string;
    page: number;
    count: number;
    reload: boolean;
}

export interface IActionDedicateRole {
    roles?: IRole[];
    detail?: IRoleDetail | null;
    deleteItems?: string[];
    key?: string;
    limit?: number;
    orderBy?: string;
    page?: number;
    count?: number;
}
