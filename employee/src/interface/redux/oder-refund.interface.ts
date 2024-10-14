import { IOrderRefundRequest } from "../api/order-refund.interface";
import { IBaseInitialState } from "./base.interface";

export interface IInitialStateOrderRefund extends IBaseInitialState {
    detail: IOrderRefundRequest | null;
    isApproving: boolean;
    isDeclining: boolean;
}

export interface IActionDedicateOrderRefund {
    detail?: IOrderRefundRequest | null;
}
