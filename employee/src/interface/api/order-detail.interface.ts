import { IOrderState } from "./order-state.interface";
import { IOrder } from "./order.interface";
import { IRefund } from "./refund.interface";
import { ITransaction } from "./transaction.interface";

export type TOrderCancel = "none" | "refundable" | "no_refund";

export interface IOrderDetail extends IOrder {
    updateState: boolean;
    cancelable: boolean;
    showUnPaid: boolean;
    cancelType: TOrderCancel;
}

export interface IOrderDetailTransaction extends ITransaction {}

export interface IOrderDetailRefund extends IRefund {}

export interface IOrderDetailState extends IOrderState {}
