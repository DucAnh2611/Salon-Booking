import { EOrderPaymentType, EOrderStatus, EOrderType } from "@/enum/order.enum";
import { ESortBy } from "@/enum/query.enum";

export interface IOrder {
    id: string;

    address: string;
    code: string;
    name: string;
    note: string;
    phone: string;

    paid: boolean;

    tax: number;
    taxRate: number;
    total: number;
    totalPaid: number;

    status: EOrderStatus;
    paymentType: EOrderPaymentType;
    type: EOrderType;

    orderDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderList extends IOrder {}

export interface IApiOrderList {
    page: number;
    limit: number;
    filter: IApiOrderListFilter;
    order: IApiOrderListSort;
}

export interface IApiOrderListFilter {
    code?: string;
    status?: EOrderStatus;
    type?: EOrderType;
    paymentType?: EOrderPaymentType;
    paid?: boolean;
    from?: Date;
    to?: Date;
}

export interface IApiOrderListSort {
    code?: ESortBy;
    status?: ESortBy;
    paid?: ESortBy;
    createdAt?: ESortBy;
    updatedAt?: ESortBy;
    total?: ESortBy;
}

export interface IOrderListResponse {
    page: number;
    limit: number;
    count: number;
    items: IOrderList[];
}
