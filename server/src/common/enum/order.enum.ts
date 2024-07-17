export enum OrderPaymentTypeEnum {
    CASH = 'CASH',
    BANK = 'BANK',
}

export enum OrderStatusEnum {
    PENDING = 1,
    CONFIRMED,

    // Product
    PROCESSING,
    SHIPPING,
    SHIPPED,
    RECEIVED,

    // Service
    CALL_CONFIRM,
    ARRIVED,
    ON_SERVICE,
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
