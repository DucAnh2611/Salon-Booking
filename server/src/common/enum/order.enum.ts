export enum OrderPaymentTypeEnum {
    CASH = 'CASH',
    BANK = 'BANK',
}

export enum OrderStatusEnum {
    CONFIRMED,
    CALL_CONFIRM,

    // Product
    PROCESSING,
    SHIPPING,
    SHIPPED,
    RECEIVED,

    // Service
    ARRIVED,
    ON_SERVICE,
    PAYING,
    FINISH,

    CANCELLED,
    RETURNED,
    REFUNDED,
}

export enum OrderPaymentStatusEnum {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
}

export enum OrderType {
    PRODUCT = 'PRODUCT',
    SERVICE = 'SERVICE',
}

export enum OrderRefundRequestStatusEnum {
    PENDING = 'PENDING',
    DECLINE = 'DECLINE',
    APPROVED = 'APPROVED',
    EXPIRED = 'EXPIRED',
    RECEIVED = 'RECEIVED',
}

export enum OrderRefundStatusEnum {
    PENDING = 'PENDING',
    DECLINE = 'DECLINE',
    APPROVED = 'APPROVED',
    RECEIVED = 'RECEIVED',
}

export enum OrderTransactionReturnPayos {
    PENDING = 'PENDING',
    PAID = 'PAID',
    PROCESSING = 'PRODCESSING',
    CANCELLED = 'CANCELLED',
}
