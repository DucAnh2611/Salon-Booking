export const ROUTER = {
    MEDIA: 'media',

    AUTH: 'auth',
    OAUTH: 'oauth',
    ROLE: 'role',
    ROLE_PERMISSION: 'role-permission',
    PERMISSION: 'permission',

    EMPLOYEE: 'employee',

    CLIENT: 'client',
    CLIENT_ADMIN: 'client-staff',

    ATTRIBUTE: 'attribute',
    ATTRIBUTE_VALUE: 'attribute-value',
    CATEGORY: 'category',

    SERVICE: 'service',
    PRODUCT: 'product',
    PRODUCT_CLIENT: 'product-client',
    SERVICE_CLIENT: 'service-client',

    VOUCHER: 'voucher',

    TRACKING: 'tracking',

    PRODUCT_BASE: 'product-base',
    PRODUCT_DETAIL: 'product-detail',
    PRODUCT_TYPES: 'product-types',

    WORKING_HOUR: 'working-hour',
    WORKING_HOUR_CLIENT: 'working-hour/client',
    SHIFT: 'shift',
    SHIFT_EMPLOYEE: 'shift-employee',
    SHIFT_EMPLOYEE_CLIENT: 'shift-employee/client',

    CART: 'cart',
    CART_PRODUCT: 'cart-product',
    CART_SERVICE: 'cart-service',

    ORDER: 'order',
    ORDER_STAFF: 'order/staff',

    PROVINCE: 'province',
    BANK: 'bank',
};

export const AUTH_ROUTE = {
    EMP_LOGIN: 'emp-login',

    CLIENT_LOGIN: 'client-login',
    CLIENT_REGISTER: 'client-register',

    EMP_REFRESH_TOKEN: 'emp-refresh-token',
    CLIENT_REFRESH_TOKEN: 'client-refresh-token',

    CLIENT_LOG_OUT: 'logout-client',
    EMP_LOG_OUT: 'logout-emp',
};

export const ROLE_ROUTE = {
    ROLE_FIND: '',
    ROLE_INFO: ':id',
    ROLE_ADD: '',
    ROLE_UPDATE: ':id',
    ROLE_DELETE_ONE: ':id',
    ROLE_DELETE_MANY: '',
};

export const ROLE_PERMISSION_ROUTE = {
    ADD: '',
    INFO: ':roleId',
    UPDATE: '',
};

export const CLIENT_ADMIN_ROUTE = {
    LIST: 'list',
    UPDATE_LOCK: 'lock',
};

export const PERMISSION_ROUTE = {
    ALL: 'all',
};

export const EMPLOYEE_ROUTE = {
    ADD: '',
    ME: 'me',
    FIND: 'find',
    INFO: ':id',
    RESET_PW: 'reset-password',
    UPDATE: ':id',
    DELETE_ONE: ':id',
    DELETE_MANY: '',
};

export const OAUTH_ROUTE = {
    GOOGLE: 'google',
    GOOGLE_REDIRECT: 'google-redirect',
    FACEBOOK: 'facebook',
    FACEBOOK_REDIRECT: 'facebook-redirect',
};

export const CLIENT_ROUTE = {
    ME: 'me',
    INFO: 'me/i',
    UPDATE: 'me/',

    VERIFY_EMAIL: 'verify-email',
    VERIFY_EMAIL_OTP: 'verify-email-otp',
    VERIFY_EMAIL_URL: 'verify-email-url',
};

export const MEDIA_ROUTE = {
    GET_MEDIA: '*',
    TEMP_UPLOAD: 'temp-upload',
    TEMP_UPLOADS: 'temp-uploads',
    UPLOAD: 'upload',

    FIND: 'find',
    UPDATE: ':id',
    DELETE: '',
};

export const ATTRIBUTE_ROUTE = {
    FIND: 'find',
    CREATE: '',
    UPDATE: ':id',
    DELETE_ONE: ':id',
    DELETE_MANY: '',
};

export const ATTRIBUTE_VALUE_ROUTE = {
    FIND: 'find',
    CREATE: '',
    UPDATE: ':id',
    DELETE_ONE: ':id',
    DELETE_MANY: '',
};
export const CLIENT_CATEGORY_ROUTE = {
    TREE: '/client/tree',
    LIST: '/client/list',
};

export const CATEGORY_ROUTE = {
    FIND: 'find',
    CREATE: '',
    UPDATE: ':id',
    DELETE_ONE: ':id',
    DELETE_MANY: '',
};

export const VOUCHER_ROUTE = {
    FIND: 'find',
    CREATE: '',
    UPDATE: ':id',
    DELETE_ONE: ':id',
    DELETE_MANY: '',
};

export const CLIENT_SERVICE_ROUTE = {
    FIND: '',
    DETAIL: 'i/:id',
    FEATURED: 'feature',
    RELATED: 'related/:id',
};

export const CLIENT_PRODUCT_ROUTE = {
    FIND: '',
    DETAIL: 'i/:id',
    RELATED: 'related/:id',
    FEATURED: 'feature',
    ON_STOCK: 'on-stock',
};

export const PRODUCT_ROUTE = {
    FIND: '',
    DETAIL: ':id',
    CREATE: '',
    UPDATE: '',
    DELETE_ONE: ':id',
    DELETE_MANY: '',
};

export const PRODUCT_BASE_ROUTE = {
    CREATE: '',
    UPDATE: ':id',
    DELETE_ONE: ':id',
};

export const PRODUCT_DETAIL_ROUTE = {
    CREATE: '',
    UPDATE: '',
    DELETE_ONE: ':id',
};

export const PRODUCT_TYPES_ROUTE = {
    CREATE: '',
    UPDATE: '',
    DELETE_ONE: ':id',
    DELETE_MANY: '',
};

export const SERVICE_ROUTE = {
    GET: '',
    DETAIL: ':id',
    CREATE: '',
    UPDATE: '',
    DELETE_ONE: ':id',
    DELETE_MANY: '',
};

export const WORKING_HOUR_ROUTE = {
    FIND: '',
    DETAIL: 'info/:id',
    CREATE: '',
    UPDATE: '',
    DELETE_ONE: ':id',
    DELETE_MANY: '',
    TOGGLE_OFF: 'toggle-off',
};

export const WORKING_HOUR_CLIENT_ROUTE = {
    SEARCH: '',
};

export const SHIFT_ROUTE = {
    FIND: '',
    DETAIL: ':id',
    CREATE: '',
    UPDATE: '',
    DELETE_ONE: ':id',
    DELETE_MANY: '',
    BOOKING: 'booking',
};

export const SHIFT_EMPLOYEE_ROUTE = {
    CREATE: '',
    UPDATE_STATUS: '',
    DELETE_ONE: '',
    DELETE_MANY: 'many',
};

export const SHIFT_EMPLOYEE_CLIENT_ROUTE = {
    SERVICE_EMPLOYEE: 'service-employee',
    CHECK_OVERLAP_SERVICE: 'overlap',
};

export const CART_ROUTE = {
    CREATE: '',
    UPDATE_STATUS: '',
    DELETE_ONE: '',
    DELETE_MANY: '',
};

export const CART_PRODUCT_ROUTE = {
    GET: 'me',
    CART_AMOUNT: 'amount',
    ADD: '',
    UPDATE: '',
    DELETE: ':id',
};

export const CART_SERVICE_ROUTE = {
    GET: 'me',
    CART_AMOUNT: 'amount',
    ADD: '',
    DELETE: ':id',
};

export const CLIENT_ORDER_ROUTE = {
    TRACKING: 'tracking/:code',

    TRACKING_REFUND: 'tracking/:id/refunds',
    TRACKING_TRANSACTION: 'tracking/:id/transactions',
    TRACKING_STATE: 'tracking/:id/states',
    TRACKING_PRODUCT: 'tracking/:id/products',
    TRACKING_SERVICE: 'tracking/:id/services',

    SEARCH: 'search',

    PLACE_PRODUCT: 'place/product',
    PLACE_SERVICE: 'place/service',
    CONFIRM_ORDER_SERVICE: 'order-service/:id/confirm',

    FAIL_TRANSACTION: ':id/transaction/fail',
    SUCCESS_TRANSACTION: ':id/transaction/success',
    CANCEL_TRANSACTION: ':id/transaction/cancel',

    GET_PAYMENT_LINK_PRODUCT: ':id/product/payment',
    GET_PAYMENT_LINK_SERVICE: ':id/service/payment',

    RECEIVE_ORDER: ':id/receive',
    RETURN_ORDER: ':id/return',
    CANCEL_ORDER: 'cancel',

    CREATE_REQUEST_REFUND: 'refund/',
    CANCEL_REQUEST_REFUND: 'refund/cancel',
    RECEIVE_REFUND: 'refund/:id/received',
};

export const ADMIN_ORDER_ROUTE = {
    LIST: '',
    DETAIL: 'd/:id',

    REFUND: 'd/:id/refunds',
    TRANSACTION: 'd/:id/transactions',
    STATE: 'd/:id/states',
    PRODUCT: 'd/:id/products',
    SERVICE: 'd/:id/services',

    ORDER_STATE_LIST: 'order-state/list',
    UPDATE_ORDER_STATE: 'order-state/',

    APPROVE_ORDER_REFUND: 'order-refund/approve',
    DECLINE_ORDER_REFUND: 'order-refund/decline',
    CREATE_OR_PAYMENT: 'order-refund/create-qr/:id',
};

export const ORDER_ROUTE = {
    LIST: 'list',
    DETAIL: ':id',

    CANCEL: 'cancel',

    UPDATE_STATE: ':id/state',

    CREATE_REQUEST_REFUND: 'refund/',
    DECLINE_REFUND: 'refund/decline',
    APROVED_REFUND: 'refund/approved',
};

export const PROVINCE_ROUTE = {
    LIST_PROVINCE: 'list-province',
    SEARCH_PROVINCE: 'search-province',
    GET_PROVINCE: 'get-province/:code',

    LIST_DISTRICT: 'list-district',
    SEARCH_DISTRICT: 'search-district',
    GET_DISTRICT: 'get-district/:code',

    LIST_WARD: 'list-ward',
    SEARCH_WARD: 'search-ward',
    GET_WARD: 'get-ward/:code',
};

export const VIETQR_ROUTE = {
    BANK_LIST: 'banks',
    QUICK_QR: 'quick-qr',
};
