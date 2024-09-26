export enum EOrderPaymentType {
    CASH = "CASH",
    BANK = "BANK",
}

export enum EOrderStatus {
    PENDING = "PENDING",
    PENDING_PAYMENT = "PENDING_PAYMENT",
    PAID_PAYMENT = "PAID_PAYMENT",

    CONFIRMED = "CONFIRMED",
    CALL_CONFIRM = "CALL_CONFIRM",

    // Product
    PROCESSING = "PROCESSING",
    SHIPPING = "SHIPPING",
    SHIPPED = "SHIPPED",
    RECEIVED = "RECEIVED",

    // Service
    ARRIVED = "ARRIVED",
    ON_SERVICE = "ON_SERVICE",
    FINISH = "FINISH",

    CANCELLED = "CANCELLED",
    RETURNED = "RETURNED",
    REFUNDED = "REFUNDED",
}

export enum EOrderPaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELLED = "CANCELLED",
}

export enum EOrderType {
    PRODUCT = "PRODUCT",
    SERVICE = "SERVICE",
}

export enum EOrderRefundRequestStatus {
    PENDING = "PENDING",
    DECLINE = "DECLINE",
    APPROVED = "APPROVED",
    EXPIRED = "EXPIRED",
    RECEIVED = "RECEIVED",
    CANCELLED = "CANCELLED",
}

export enum EOrderRefundStatus {
    PENDING = "PENDING",
    DECLINE = "DECLINE",
    APPROVED = "APPROVED",
    RECEIVED = "RECEIVED",
    CANCELLED = "CANCELLED",
}

export enum EOrderTransactionReturnPayos {
    PENDING = "PENDING",
    PAID = "PAID",
    PROCESSING = "PRODCESSING",
    CANCELLED = "CANCELLED",
}
