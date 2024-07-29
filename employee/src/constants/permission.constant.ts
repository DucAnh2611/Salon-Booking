import { EAction, ETarget } from "@/enum/permisssion.enum";

export const TARGET_TEXT: Record<ETarget, string> = {
    [ETarget.VOUCHER]: "Phiếu giảm giá",
    [ETarget.MEDIA]: "File phương tiện",

    [ETarget.PRODUCT]: "Sản phẩm",
    [ETarget.PRODUCT_DETAIL]: "Chi tiết sản phẩm",
    [ETarget.PRODUCT_TYPE]: "Loại sản phẩm",

    [ETarget.SERVICE]: "Dịch vụ",
    [ETarget.SERVICE_STEP]: "Các bước dịch vụ",
    [ETarget.SERVICE_EMPLOYEE]: "Nhân viên cho dịch vụ",

    [ETarget.EMPLOYEE]: "Nhân viên",
    [ETarget.USER]: "Người dùng",
    [ETarget.CLIENT]: "Khách hàng",

    [ETarget.ROLE]: "Chức vụ",
    [ETarget.PERMISSION]: "Quyền hạn",
    [ETarget.ROLE_PERMISSION]: "Quyền hạn cho chức vụ",

    [ETarget.ATTRIBUTE]: "Thuộc tính",
    [ETarget.ATTRIBUTE_VALUE]: "Giá trị thuộc tính",
    [ETarget.CATEGORY]: "Danh mục sản phẩm",

    [ETarget.WORKING_HOUR]: "Giờ, ngày làm việc làm việc",
    [ETarget.SHIFT]: "Ca làm việc",
    [ETarget.SHIFT_EMPLOYEE]: "Nhân viên của ca làm việc",

    [ETarget.ORDER_SERVICE]: "Đơn hàng dịch vụ",
    [ETarget.ORDER_PRODUCT]: "Đơn hàng sản phẩm",
};

export const ACTION_TEXT: Record<EAction, string> = {
    [EAction.READ]: "Xem, tìm kiếm",
    [EAction.CREATE]: "Thêm mới",
    [EAction.UPDATE]: "Sửa ",
    [EAction.DELETE]: "Xóa",
};
