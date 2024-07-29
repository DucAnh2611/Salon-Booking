import { IProduct, IProductInfo } from "../api/product.interface";
import { ICRUDInitialState } from "./base.interface";

export interface IInitialStateProduct extends ICRUDInitialState {
    products: IProduct[];
    deleteItems: string[];
    page: number;
    limit: number;
    count: number;
    key: string;
    orderBy: string;
    detail: IProductInfo | null;
}

export interface IActionDedicateProduct {
    products?: IProduct[];
    deleteItems?: string[];
    page?: number;
    limit?: number;
    count?: number;
    key?: string;
    orderBy?: string;
    detail?: IProductInfo | null;
}
