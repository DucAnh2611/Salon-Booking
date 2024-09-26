import { EOrderStatus } from "@/enum/order.enum";

export interface IOrderState {
    id: string;
    state: EOrderStatus;
    orderId: string;
    description: string;
    createdAt: string;
    createdBy: string;
}

export interface IApiUpdateOrderState {
    orderId: string;
    state: EOrderStatus;
    description?: string;
}
