import { EOrderStatus } from "@/enum/order.enum";
import { IServiceItemOrder } from "./service.interface";

export interface IJob extends IServiceItemOrder {
    orderStatus: EOrderStatus;
    orderPaid: boolean;
    totalPaid: number;
    orderCode: string;
    total: number;
    clientName: string;
    clientPhone: string;
}

export interface IListJob {
    page: number;
    limit: number;
    from?: Date;
    to?: Date;
}

export interface IListJobReponse {
    page: number;
    limit: number;
    items: IJob[];
    count: number;
}
