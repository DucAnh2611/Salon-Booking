import { IAttribute } from "../api/attribute.interface";
import { ICRUDInitialState } from "./base.interface";

export interface IInitialStateAttribute extends ICRUDInitialState {
    attrs: IAttribute[];
    page: number;
    limit: number;
    count: number;
    key: string;
    orderBy: string;
}

export interface IActionDedicateAttribute {
    attrs?: IAttribute[];
    page?: number;
    limit?: number;
    count?: number;
    key?: string;
    orderBy?: string;
}
