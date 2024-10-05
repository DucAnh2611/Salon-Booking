import { OrderType } from '../../../common/enum/order.enum';

export interface PlaceOrderMessage {
    orderType: OrderType;
    orderCode: string;
    orderId: string;
    employeeIds: string[];
}

export interface ClientTrackingMessage {
    orderId: string;
}

export interface EmployeeTrackingMessage {
    orderId: string;
}

export interface ClientUntrackMessage {
    orderId: string;
}

export interface EmployeeUntrackMessage {
    orderId: string;
}
