import { EOrderStatus, EOrderType } from "@/enum/order.enum";
import { IBaseInitialState } from "./base.interface";

export interface IInitialStateOrderState extends IBaseInitialState {
    isUpdating: boolean;
    typeState: EOrderType | null;
    items: EOrderStatus[];
}

export interface IActionDedicateOrderState {
    typeState?: EOrderType | null;
    items?: EOrderStatus[];
}
