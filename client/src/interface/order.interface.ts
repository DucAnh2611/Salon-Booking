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

    paid: boolean;

    tax: number;
    taxRate: number;
    total: number;
    totalPaid: number;

    status: EOrderStatus;
    paymentType: EOrderPaymentType;
    type: EOrderType;
    confirmExpired: Date | null;

    orderDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderDetail extends IOrderSearch {
    cancelable: boolean;
    returnable: boolean;
    receivable: boolean;
    createPayment: boolean;
    confirmable: boolean;
}

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
    createdAt?: ESortBy;
    updatedAt?: ESortBy;
    total?: ESortBy;
}

export interface IOrderTracking {
    order: IOrderDetail | null;
    isLoading: boolean;
    isError: boolean;
}

export interface IApiCancelOrder {
    orderId: string;
    reason: string;
}

export interface IApiCancelRefund {
    orderId: string;
    requestId: string;
    note: string;
}

export interface IPlaceOrderServiceContact {
    name: string;
    phone: string;
    note?: string;
}

export interface IPlaceOrderServiceServices {
    itemId: string;
    employeeId: string | null;
    serviceId: string;
    shiftId: string | null;
    bookingTime: Date | null;
}

export interface IPlaceOrderService {
    contact: IPlaceOrderServiceContact;
    paymentType: TPlaceOrderProductPaymentType;
    services: IPlaceOrderServiceServices[];
}
