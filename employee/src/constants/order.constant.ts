import {
    EOrderPaymentStatus,
    EOrderPaymentType,
    EOrderRefundRequestStatus,
    EOrderRefundStatus,
    EOrderStatus,
    EOrderType,
} from "@/enum/order.enum";
import { ESortBy } from "@/enum/query.enum";
import { ICancelRefundReason } from "@/interface/cancel-reason.interface";

export const ORDER_PAYMENT_TYPE: Record<EOrderPaymentType, string> = {
    [EOrderPaymentType.CASH]: "Tiền mặt",
    [EOrderPaymentType.BANK]: "Chuyển khoản",
};

export const ORDER_STATUS: Record<EOrderStatus, string> = {
    [EOrderStatus.PENDING]: "Tạo dơn hàng",
    [EOrderStatus.PENDING_PAYMENT]: "Đợi thanh toán",
    [EOrderStatus.PAID_PAYMENT]: "Thanh toán thành công",

    [EOrderStatus.CONFIRMED]: "Đã xác nhận đơn hàng",
    [EOrderStatus.CALL_CONFIRM]: "Đã gọi điện xác nhận",

    [EOrderStatus.PROCESSING]: "Đang xử lý",
    [EOrderStatus.SHIPPING]: "Đang giao hàng",
    [EOrderStatus.SHIPPED]: "Đã giao hàng",
    [EOrderStatus.RECEIVED]: "Đã nhận",

    [EOrderStatus.ARRIVED]: "Khách hàng đã tới",
    [EOrderStatus.ON_SERVICE]: "Đang trong dịch vụ",
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
    [EOrderRefundRequestStatus.CANCELLED]: "Đã hủy",
};

export const ORDER_REFUND_STATUS: Record<EOrderRefundStatus, string> = {
    [EOrderRefundStatus.PENDING]: "Chờ duyệt",
    [EOrderRefundStatus.DECLINE]: "Từ chối hoàn tiền",
    [EOrderRefundStatus.APPROVED]: "Đã duyệt",
    [EOrderRefundStatus.RECEIVED]: "Đã nhận",
    [EOrderRefundStatus.CANCELLED]: "Đã hủy",
};

export const REASON_CANCEL_REFUND: ICancelRefundReason[] = [
    { id: "RS_01", value: "Sai thông tin tài khoản nhận tiền" },
    { id: "RS_02", value: "Khác" },
];
