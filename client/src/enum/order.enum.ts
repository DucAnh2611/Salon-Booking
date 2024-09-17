export enum EOrderPaymentType {
    CASH = "CASH",
    BANK = "BANK",
}

export enum EOrderStatus {
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
}

export enum EOrderRefundStatus {
    PENDING = "PENDING",
    DECLINE = "DECLINE",
    APPROVED = "APPROVED",
    RECEIVED = "RECEIVED",
}

export enum EOrderTransactionReturnPayos {
    PENDING = "PENDING",
    PAID = "PAID",
    PROCESSING = "PRODCESSING",
    CANCELLED = "CANCELLED",
}

export enum ESortBy {
    DESC = "DESC",
    ASC = "ASC",
}

export enum EOperator {
    IN = "IN",
    GTE = "GTE",
    GT = "GT",
    E = "E",
    NE = "NE",
    L = "L",
    LE = "LE",
    STW = "STW",
    EW = "EW",
    CT = "CT",
}
