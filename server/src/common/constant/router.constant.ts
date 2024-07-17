export const ROUTER = {
    MEDIA: 'media',

    AUTH: 'auth',
    OAUTH: 'oauth',
    ROLE: 'role',
    ROLE_PERMISSION: 'role-permission',
    PERMISSION: 'permission',

    EMPLOYEE: 'employee',

    CLIENT: 'client',

    ATTRIBUTE: 'attribute',
    ATTRIBUTE_VALUE: 'attribute-value',
    CATEGORY: 'category',

    SERVICE: 'service',
    PRODUCT: 'product',

    VOUCHER: 'voucher',

    TRACKING: 'tracking',

    PRODUCT_BASE: 'product-base',
    PRODUCT_DETAIL: 'product-detail',
    PRODUCT_TYPES: 'product-types',

    WORKING_HOUR: 'working-hour',
    SHIFT: 'shift',
    SHIFT_EMPLOYEE: 'shift-employee',

    CART: 'cart',
    CART_PRODUCT: 'cart-product',
    CART_SERVICE: 'cart-service',

    ORDER: 'order',
    ORDER_PRODUCT: 'order-product',
    ORDER_SERVICE: 'order-service',
};

export const AUTH_ROUTE = {
    EMP_LOGIN: 'emp-login',

    CLIENT_LOGIN: 'client-login',
    CLIENT_REGISTER: 'client-register',

    REFRESH_TOKEN: 'refresh-token',
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

export const PERMISSION_ROUTE = {
    ALL: 'all',
};

export const EMPLOYEE_ROUTE = {
    ADD: '',
    FIND: 'find',
    INFO: ':id',
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
    VERIFY_EMAIL: 'verify-email',
    VERIFY_EMAIL_OTP: 'verify-email-otp',
};

export const MEDIA_ROUTE = {
    GET_MEDIA: '*',
    TEMP_UPLOAD: 'temp-upload',
    UPLOAD: 'upload',
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

export const PRODUCT_ROUTE = {
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
    CREATE: '',
    UPDATE: '',
    DELETE_ONE: ':id',
    DELETE_MANY: '',
};

export const WORKING_HOUR_ROUTE = {
    CREATE: '',
    DETAIL: ':id',
    UPDATE: '',
    DELETE_ONE: ':id',
    DELETE_MANY: '',
    TOGGLE_OFF: 'toggle-off/:id',
};

export const SHIFT_ROUTE = {
    CREATE: '',
    UPDATE: '',
    DELETE_ONE: ':id',
    DELETE_MANY: '',
};

export const SHIFT_EMPLOYEE_ROUTE = {
    CREATE: '',
    UPDATE_STATUS: '',
    DELETE_ONE: '',
    DELETE_MANY: '',
};

export const CART_ROUTE = {
    CREATE: '',
    UPDATE_STATUS: '',
    DELETE_ONE: '',
    DELETE_MANY: '',
};

export const CART_PRODUCT_ROUTE = {
    GET: 'me',
    ADD: '',
    UPDATE: '',
    DELETE: ':id',
};

export const CART_SERVICE_ROUTE = {
    GET: 'me',
    ADD: '',
    DELETE: ':id',
};

export const ORDER_ROUTE = {
    TRACKING: 'tracking/:id',
    PRODUCT: 'order-product',
    SERVICE: 'order-service',
};
