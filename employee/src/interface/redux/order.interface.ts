import {
    IApiOrderListFilter,
    IApiOrderListSort,
    IOrderList,
} from "../api/order.interface";
import { IBaseInitialState } from "./base.interface";

export interface IInitialStateOrder extends IBaseInitialState {
    reload: boolean;
    orders: IOrderList[];
    page: number;
    limit: number;
    count: number;
    filter: IApiOrderListFilter;
    sort: IApiOrderListSort;
}

export interface IActionDedicateOrder {
    orders?: IOrderList[];
    page?: number;
    limit?: number;
    count?: number;
    filter?: IApiOrderListFilter;
    sort?: IApiOrderListSort;
}
