import {
    EOrderPaymentStatus,
    EOrderPaymentType,
    EOrderRefundRequestStatus,
    EOrderRefundStatus,
    EOrderStatus,
    EOrderType,
    ESortBy,
} from "@/enum/order.enum";

export const ORDER_PAYMENT_TYPE: Record<EOrderPaymentType, string> = {
    [EOrderPaymentType.CASH]: "Tiền mặt",
    [EOrderPaymentType.BANK]: "Chuyển khoản",
};

export const ORDER_STATUS: Record<EOrderStatus, string> = {
    [EOrderStatus.CONFIRMED]: "Đã đặt đơn",

    [EOrderStatus.CALL_CONFIRM]: "Đã gọi điện xác nhận",
    [EOrderStatus.PROCESSING]: "Đang xử lý",
    [EOrderStatus.SHIPPING]: "Đang giao hàng",
    [EOrderStatus.SHIPPED]: "Đã giao hàng",
    [EOrderStatus.RECEIVED]: "Đã nhận",

    [EOrderStatus.ARRIVED]: "Đã tới",
    [EOrderStatus.ON_SERVICE]: "Đang trong dịch vụ",
    [EOrderStatus.PAYING]: "Đang thanh toán",
    [EOrderStatus.FINISH]: "Hoàn thành",

    [EOrderStatus.CANCELLED]: "Đã hủy",
    [EOrderStatus.RETURNED]: "Đã hoàn đơn",
    [EOrderStatus.REFUNDED]: "Đã hoàn tiền",
};

export const ORDER_TYPE: Record<EOrderType, string> = {
    [EOrderType.PRODUCT]: "Đơn sản phẩm",
    [EOrderType.SERVICE]: "Đơn dịch vụ",
};

export const SORT_BY: Record<ESortBy, string> = {
    [ESortBy.ASC]: "Tăng dần",
    [ESortBy.DESC]: "Giảm dần",
};

export const ORDER_PAYMENT_STATUS: Record<EOrderPaymentStatus, string> = {
    [EOrderPaymentStatus.PENDING]: "Chờ thanh toán",
    [EOrderPaymentStatus.PAID]: "Đã thanh toán",
    [EOrderPaymentStatus.CANCELLED]: "Đã hủy",
};

export const ORDER_REFUND_REQUEST_STATUS: Record<
    EOrderRefundRequestStatus,
    string
> = {
    [EOrderPaymentStatus.PENDING]: "Chờ duyệt",
    [EOrderRefundRequestStatus.DECLINE]: "Từ chối hoàn tiền",
    [EOrderRefundRequestStatus.APPROVED]: "Đã duyệt",
    [EOrderRefundRequestStatus.EXPIRED]: "Hết hạn",
    [EOrderRefundRequestStatus.RECEIVED]: "Đã nhận",
};

export const ORDER_REFUND_STATUS: Record<EOrderRefundStatus, string> = {
    [EOrderRefundStatus.PENDING]: "Chờ duyệt",
    [EOrderRefundStatus.DECLINE]: "Từ chối hoàn tiền",
    [EOrderRefundStatus.APPROVED]: "Đã duyệt",
    [EOrderRefundStatus.RECEIVED]: "Đã nhận",
};
