import { EDataErrorCode } from "@/enum/data-code-error.enum";
import { ERequestErrorCode } from "@/enum/request-code-error.enum";

export const REQUEST_ERROR_CODE: Record<ERequestErrorCode, string> = {
    [ERequestErrorCode.BAD_REQUEST]: "Yêu cầu không hợp lệ",
    [ERequestErrorCode.SERVER_INTERNAL]: "Lỗi nội bộ máy chủ",
    [ERequestErrorCode.FORBIDDEN]: "Không được cấp phép",
    [ERequestErrorCode.UNAUTHORIZATION]: "Không có quyền truy cập",
    [ERequestErrorCode.NOT_FOUND]: "Không tìm thấy",
    [ERequestErrorCode.INTERNAL_SERVER_ERROR]: "Lỗi nội bộ máy chủ lần nữa",
    [ERequestErrorCode.UNAUTHORIZED]: "Không được ủy quyền",
    [ERequestErrorCode.BAD_PERMISSION]: "Quyền truy cập không hợp lệ",
};

export const DATA_ERROR_CODE: Record<EDataErrorCode, string> = {
    // Internal error
    DE999: "Lỗi nội bộ",

    // Action errors
    DE001: "Không thể thực hiện hành động",

    // Verification errors
    DE002: "Email đã được xác minh",

    // Existence errors
    DE003: "Tồn tại",
    DE004: "Voucher đã tồn tại",
    DE005: "Tên người dùng đã tồn tại",
    DE006: "Khóa chi tiết sản phẩm đã tồn tại",
    DE007: "Sản phẩm đã tồn tại",
    DE008: "Loại sản phẩm đã tồn tại",
    DE009: "Dịch vụ đã tồn tại",
    DE010: "Bước dịch vụ đã tồn tại",
    DE011: "Giờ làm việc đã tồn tại",
    DE012: "Mặt hàng giỏ hàng sản phẩm đã tồn tại",

    // Nonexistence errors
    DE013: "Không tồn tại",
    DE014: "Danh mục không tồn tại",
    DE015: "Hình ảnh không tồn tại",
    DE016: "Voucher không tồn tại",
    DE017: "Nhân viên không tồn tại",
    DE018: "Người dùng không tồn tại",
    DE019: "Thuộc tính không tồn tại",
    DE020: "Sản phẩm không tồn tại",
    DE021: "Loại sản phẩm không tồn tại",
    DE022: "Phương tiện không tồn tại",
    DE023: "Khóa chi tiết sản phẩm không tồn tại",
    DE024: "Vai trò không tồn tại",
    DE025: "Quyền vai trò không tồn tại",
    DE026: "Quyền không tồn tại",
    DE027: "Dịch vụ cha không tồn tại",
    DE028: "Dịch vụ không tồn tại",
    DE029: "Bước dịch vụ không tồn tại",
    DE030: "Nhân viên dịch vụ không tồn tại",
    DE031: "Giờ làm việc không tồn tại",
    DE032: "Phân công ca không tồn tại",
    DE033: "Ca làm việc không tồn tại",
    DE034: "Giỏ hàng không tồn tại",
    DE035: "Giỏ hàng sản phẩm không tồn tại",
    DE036: "Giỏ hàng dịch vụ không tồn tại",
    DE037: "Mặt hàng giỏ hàng sản phẩm không tồn tại",
    DE038: "Mặt hàng giỏ hàng dịch vụ không tồn tại",
    DE081: "Đơn hàng không tồn tại",

    // Invalid input errors
    DE039: "Giá trị thuộc tính không hợp lệ",
    DE040: "Vai trò khách hàng không hợp lệ",
    DE041: "Email không hợp lệ",
    DE042: "Thời gian kết thúc không hợp lệ",
    DE043: "Tệp không hợp lệ",
    DE044: "Loại tệp không hợp lệ",
    DE045: "OTP không hợp lệ",
    DE046: "Vai trò không hợp lệ",
    DE047: "Vai trò nhân viên không hợp lệ",
    DE048: "Token không hợp lệ",
    DE049: "Vai trò người dùng không hợp lệ",
    DE050: "Loại người dùng không hợp lệ",
    DE051: "Loại phương tiện không hợp lệ",
    DE052: "Cấp độ bước dịch vụ không hợp lệ",
    DE053: "Khoảng thời gian không hợp lệ",
    DE054: "Thời gian ca làm việc không hợp lệ",
    DE079: "Nhân viên dịch vụ không hợp lệ",
    DE083: "Định dạng thời gian không hợp lệ",

    // Missing data errors
    DE055: "Thiếu dữ liệu",
    DE056: "Không có mã OTP",
    DE057: "Thiếu hình thu nhỏ",

    // OTP errors
    DE058: "OTP đã hết hạn",
    DE059: "OTP không khớp",

    // Format errors
    DE060: "Định dạng sai",
    DE061: "Mật khẩu sai",

    DE062: "Voucher đã hết hạn",
    DE063: "Voucher hết lượt sử dụng",

    // Attributes
    DE064: "Thuộc tính cùng cấp độ",

    // Working Hour
    DE065: "Không cùng ngày",
    DE066: "Ngày âm",
    DE067: "Phân công không thuộc về",
    DE068: "Ca làm việc ngoài giờ làm việc",
    DE069: "Thời gian đặt chỗ ngoài ca",
    DE070: "Ca làm việc bị lồng nhau",
    DE071: "Ca làm việc đã bắt đầu",
    DE072: "Nhân viên không trong ca",

    // Cart
    DE073: "Không sở hữu giỏ hàng",
    DE074: "Các loại không khớp",
    DE075: "Không có giỏ hàng hoạt động",
    DE076: "Dịch vụ đã được thêm",
    DE077: "Dịch vụ chưa được thêm",
    DE078: "Yêu cầu loại sản phẩm",
    DE080: "Không có mặt hàng đơn hàng",

    // Order
    DE082: "Đơn hàng bị cấm",
    DE084: "Sản phẩm hết hàng",
    DE085: "Các loại sản phẩm hết hàng",
    DE086: "Không thể gắn danh mục cha là chính mình",
    DE087: "Danh mục sản phẩm được chọn có danh mục cha là danh mục hiện tại.",
    DE088: "Không tồn tại vai trò cha",
    DE089: "Vai trò không thể xóa",
    DE090: "Vai trò bị lồng nhau",
    DE091: "Vai trò liên kết với chính nó",
    DE092: "Vai trò không thể sửa đổi",
    DE093: "Vai trò cha không thể cao hơn nhân viên",
    DE094: "Tự xóa nhân viên",
    DE095: "Xóa quản trị viên",
    DE096: "Không thể thay đổi vai trò quản trị viên",
    DE097: "Đã tồn tại sản phẩm với SKU",
    DE098: "Giờ làm việc bắt đầu",

    [EDataErrorCode.MAXIMUM_ORDER_STATE_REACH]: "",
    [EDataErrorCode.ORDER_STATE_EXIST]: "",
    [EDataErrorCode.INVALID_ORDER_STATE]: "",
    [EDataErrorCode.NOT_EXIST_CLIENT]: "",
    [EDataErrorCode.CAN_NOT_CANCEL_ORDER]: "",
    [EDataErrorCode.ORDER_PAYMENT_TYPE_IS_NOT_BANK]: "",
    [EDataErrorCode.ORDER_IS_NOT_PAID]: "",
    [EDataErrorCode.ORDER_PAID]: "",
    [EDataErrorCode.MISSING_ORDER_REFUND_BANK_INFO]: "",
    [EDataErrorCode.NOT_EXIST_ORDER_TRANSACTION]: "",
    [EDataErrorCode.NOT_EXIST_PAYMENT_TRANSACTION]: "",
    [EDataErrorCode.REFUND_REQUEST_MUST_APPROVED]: "",
    [EDataErrorCode.REFUND_REQUEST_MUST_BE_PENDING]: "",
    [EDataErrorCode.EXISTED_CLIENT]: "",
    [EDataErrorCode.NOT_EXISTE_TYPE_ATTRIBUTE_VALUE]: "",
    [EDataErrorCode.SAME_SKU]: "",
    [EDataErrorCode.PRODUCT_CART_ITEM_NOT_MATCH]: "",
    [EDataErrorCode.FULFULLIED_PAID_AMOUNT]: "",
    [EDataErrorCode.PAYMENT_PROCESSED]: "",
    [EDataErrorCode.REFUND_REQUEST_IS_PROCESSING]: "",
    [EDataErrorCode.INVALID_ACCESS_TOKEN]: "",
    [EDataErrorCode.INVALID_REFRESH_TOKEN]: "",
};
