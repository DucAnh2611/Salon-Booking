export enum EReduxDispatchDedicateState {
    CALLING = "[CALLING]",
    SUCCESS = "[SUCCESS]",
    FAILURE = "[FAILURE]",
}
export enum EReduxType {
    THEME_SWITCH = "THEME_SWITCH",

    AUTH_LOGIN = "AUTH_LOGIN",
    ME = "AUTH_ME",
    AUTH_TOKEN = "AUTH_TOKEN ",
    AUTH_LOGOUT = "AUTH_LOGOUT",

    ATTRIBUTE_LIST = "ATTRIBUTE_LIST",
    ATTRIBUTE_CREATE = "ATTRIBUTE_CREATE",

    CATEGORY_LIST = "CATEGORY_LIST",
    CATEGORY_CREATE = "CATEGORY_CREATE",
    CATEGORY_DELETE_LIST = "CATEGORY_DELETE_LIST",
    CATEGORY_DELETE = "CATEGORY_DELETE",
    CATEGORY_UPDATE = "CATEGORY_UPDATE",

    MEDIA_LIST = "MEDIA_LIST",
    MEDIA_LIST_PARAM = "MEDIA_LIST_PARAM",
    MEDIA_CREATE = "MEDIA_CREATE",
    MEDIA_DELETE_LIST = "MEDIA_DELETE_lIST",
    MEDIA_DELETE = "MEDIA_DELETE",
    MEDIA_UPDATE = "MEDIA_UPDATE",
    MEDIA_TEMP_UPLOAD = "MEDIA_TEMP_LOAD",

    ROLE_LIST = "ROLE_LIST",
    ROLE_LIST_PARAM = "ROLE_LIST_PARAM",
    ROLE_DETAIL = "ROLE_DETAIL",
    ROLE_CREATE = "ROLE_CREATE",
    ROLE_DELETE_LIST = "ROLE_DELETE_LIST",
    ROLE_DELETE = "ROLE_DELETE",
    ROLE_UPDATE = "ROLE_UPDATE",

    PERMISSION_LIST = "PERMISSION_LIST",

    EMPLOYEE_LIST = "EMPLOYEE_LIST",
    EMPLOYEE_LIST_PARAM = "EMPLOYEE_LIST_PARAM",
    EMPLOYEE_DETAIL = "EMPLOYEE_DETAIL",
    EMPLOYEE_CREATE = "EMPLOYEE_CREATE",
    EMPLOYEE_DELETE_LIST = "EMPLOYEE_DELETE_LIST",
    EMPLOYEE_DELETE = "EMPLOYEE_DELETE",
    EMPLOYEE_UPDATE = "EMPLOYEE_UPDATE",
    EMPLOYEE_RESET_PASSWORD = "EMPLOYEE_RESET_PASSWORD",

    PRODUCT_LIST = "PRODUCT_LIST",
    PRODUCT_LIST_PARAM = "PRODUCT_LIST_PARAM",
    PRODUCT_DETAIL = "PRODUCT_DETAIL",
    PRODUCT_CREATE = "PRODUCT_CREATE",
    PRODUCT_DELETE_LIST = "PRODUCT_DELETE_LIST",
    PRODUCT_DELETE = "PRODUCT_DELETE",
    PRODUCT_UPDATE = "PRODUCT_UPDATE",

    SERVICE_LIST = "SERVICE_LIST",
    SERVICE_LIST_PARAM = "SERVICE_LIST_PARAM",
    SERVICE_DETAIL = "SERVICE_DETAIL",
    SERVICE_CREATE = "SERVICE_CREATE",
    SERVICE_DELETE_LIST = "SERVICE_DELETE_LIST",
    SERVICE_DELETE = "SERVICE_DELETE",
    SERVICE_UPDATE = "SERVICE_UPDATE",

    WORKING_HOUR_RANGE = "HORKING_HOUR_RANGE",
    WORKING_HOUR_DETAIL = "WORKING_HOUR_DETAIL",
    WORKING_HOUR_CREATE = "WORKING_HOUR_CREATE",
    WORKING_HOUR_UPDATE = "WORKING_HOUR_UPDATE",
    WORKING_HOUR_TOGGLE_OFF = "WORKING_HOUR_TOGGLE_OFF",
    WORKING_HOUR_DELETE = "WORKING_HOUR_DELETE",

    SHIFT_DETAIL = "SHIFT_DETAIL",
    SHIFT_UPDATE = "SHIFT_UPDATE",
    SHIFT_CREATE = "SHIFT_CREATE",
    SHIFT_DELETE = "SHIFT_DELETE",

    SHIFT_ASSIGNMENT_REMOVE = "SHIFT_ASSIGNMENT_REMOVE",
    SHIFT_ASSIGNMENT_ADD = "SHIFT_ASSIGNMENT_ADD",

    ORDER_LIST = "ORDER_LIST",
    ORDER_DETAIL = "ORDER_DETAIL",

    ORDER_REFUND_LIST = "ORDER_REFUND_LIST",
    ORDER_TRANSACTION_LIST = "ORDER_TRANSACTION_LIST",
    ORDER_STATE_LIST = "ORDER_STATE_LIST",
    ORDER_PRODUCT_LIST = "ORDER_PRODUCT_LIST",
    ORDER_SERVICE_LIST = "ORDER_SERVICE_LIST",

    ORDER_RELOAD_STATE = "ORDER_RELOAD_STATE",

    LIST_ORDER_STATE = "LIST_ORDER_STATE",
    UPDATE_ORDER_STATE = "UPDATE_ORDER_STATE",

    APPROVE_ORDER_REFUND = "APPROVE_ORDER_REFUND",
    DECLINE_ORDER_REFUND = "DECLINE_ORDER_REFUND",

    RELOAD_CLIENT = "RELOAD_CLIENT",
    LIST_CLIENT = "LIST_CLIENT",
    UPDATE_CLIENT_LOCK = "UPDATE_CLIENT_LOCK",
}
