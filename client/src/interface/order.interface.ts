import {
    EOrderPaymentType,
    EOrderStatus,
    EOrderType,
    ESortBy,
} from "@/enum/order.enum";

export interface IOrder {
    id: string;

    address: string;
    code: string;
    name: string;
    note: string;
    phone: string;

    refund: boolean;
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

export interface IOrderDetail extends IOrderSearch {}

export interface IOrderSearch extends IOrder {}

export interface IOrderSearchResponse {
    items: IOrderSearch[];
    count: number;
    page: number;
    limit: number;
}

export interface IPlaceOrderResponse {
    id: string;
    address: string;
    code: string;
    createdAt: Date;
    name: string;
    note: string;
    orderDate: Date;
    paid: boolean;
    paymentType: EOrderPaymentType;
    phone: string;
    refund: boolean;
    status: EOrderStatus;
    tax: number;
    taxRate: number;
    total: number;
}

export interface IPlaceOrderProduct {
    contact: IPlaceOrderProductContact;
    paymentType: TPlaceOrderProductPaymentType;
    products: IPlaceOrderProductProducts[];
}

export interface IPlaceOrderProductContact {
    name: string;
    address: string;
    phone: string;
    note?: string;
}

export type TPlaceOrderProductPaymentType = EOrderPaymentType;

export interface IPlaceOrderProductProducts {
    itemId: string;
    productId: string;
    productTypeId?: string;
    quantity: number;
}

export interface IApiListOrder {
    filter: IListOrderFilter;
    order: IListOrderOrder;
    page: number;
    limit: number;
}

export interface IListOrderFilter {
    code?: string;
    status?: EOrderStatus;
    paid?: boolean;
    refund?: boolean;
    type?: EOrderType;
    paymentType?: EOrderPaymentType;
    from?: Date;
    to?: Date;
}

export interface IListOrderOrder {
    code?: ESortBy;
    status?: ESortBy;
    paid?: ESortBy;
    refund?: ESortBy;
    createdAt?: ESortBy;
    updatedAt?: ESortBy;
    total?: ESortBy;
}

export interface IOrderTracking {
    order: IOrderDetail | null;
    isLoading: boolean;
    isError: boolean;
}
