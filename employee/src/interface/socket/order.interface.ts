import { EOrderType } from "@/enum/order.enum";

export interface ISocketOrderPlacedMessage {
    orderType: EOrderType;
    orderCode: string;
    orderId: string;
    employeeIds: string[];
}

export interface ISocketTrackingOrderData {
    orderId: string;
}
