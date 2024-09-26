export enum OrderPaymentTypeEnum {
    CASH = 'CASH',
    BANK = 'BANK',
}

export enum OrderStatusEnum {
    PENDING = 'PENDING',
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    PAID_PAYMENT = 'PAID_PAYMENT',

    CONFIRMED = 'CONFIRMED',
    CALL_CONFIRM = 'CALL_CONFIRM',

    // Product
    PROCESSING = 'PROCESSING',
    SHIPPING = 'SHIPPING',
    SHIPPED = 'SHIPPED',
    RECEIVED = 'RECEIVED',

    // Service
    ON_SERVICE = 'ON_SERVICE',
    FINISH = 'FINISH',

    CANCELLED = 'CANCELLED',
    RETURNED = 'RETURNED',
    REFUNDED = 'REFUNDED',
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
    CANCELLED = 'CANCELLED',
}

export enum OrderRefundStatusEnum {
    PENDING = 'PENDING',
    DECLINE = 'DECLINE',
    APPROVED = 'APPROVED',
    RECEIVED = 'RECEIVED',
    CANCELLED = 'CANCELLED',
}

export enum OrderTransactionReturnPayos {
    PENDING = 'PENDING',
    PAID = 'PAID',
    PROCESSING = 'PRODCESSING',
    CANCELLED = 'CANCELLED',
}
