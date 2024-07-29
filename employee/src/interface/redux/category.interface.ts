import { ICategory } from "../api/category.interface";
import { ICRUDInitialState } from "./base.interface";

export interface IInitialStateCategoy extends ICRUDInitialState {
    page: number;
    limit: number;
    count: number;
    key: string;
    orderBy: string;
    items: ICategory[];
    deleteItems: string[];
}

export interface IActionDedicateCategory {
    page?: number;
    limit?: number;
    count?: number;
    key?: string;
    orderBy?: string;
    items?: ICategory[];
    deleteItems?: string[];
}
