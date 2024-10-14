export enum SocketEventEnum {
    EMPLOYEE_LOGIN = 'EMPLOYEE_LOGIN',
    EMPLOYEE_ME = 'EMPLOYEE_ME',

    CLIENT_TRACKING_ORDER = 'CLIENT_TRACKING_ORDER',

    CLIENT_LOGIN = 'CLIENT_LOGIN',

    ORDER_PLACED = 'ORDER_PLACED',
    ORDER_CANCELlED = 'ORDER_CANCELLED',
    EMPLOYEE_ORDER_UPDATED = 'EMPLOYEE_ORDER_UPDATED_STATE',
    CLIENT_ORDER_UPDATED = 'CLIENT_ORDER_UPDATED',

    UPDATE_CURRENT_ORGANIZATION = 'UDPATE_CURRENT_ORGANIZATION',

    SUCCESS_REFUND_REQUEST = 'SUCCESS_REFUND_REQUEST',
}

export enum SocketMessageEnum {
    EPLOYEE_JOIN_HOST = 'EMPLOYEE_JOIN_HOST',
    CLIENT_JOIN_HOST = 'CLIENT_JOIN_HOST',

    CLIENT_TRACKING_ORDER = 'CLIENT_TRACKING_ORDER',
    EMPLOYEE_TRACKING_ORDER = 'EMPLOYEE_TRACKING_ORDER',

    EMPLOYEE_UNTRACK_ORDER = 'EMPLOYEE_UNTRACK_ORDER',
    CLIENT_UNTRACK_ORDER = 'CLIENT_UNTRACK_ORDER',

    LISTEN_REFUND_REQUEST = 'LISTEN_REFUND_REQUEST',
    LEAVE_REFUND_REQUEST = 'LEAVE_REFUND_REQUEST',
}
