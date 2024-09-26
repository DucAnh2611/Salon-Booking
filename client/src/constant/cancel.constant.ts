import { ICancelOrderReason } from "@/interface/cancel.interface";

export const CANCEL_ORDER_REASON: ICancelOrderReason[] = [
    { id: "COR_01", value: "Đổi địa chỉ" },
    { id: "COR_02", value: "Chọn sai phương thức thanh toán" },
    { id: "COR_99", value: "Khác" },
];
