export const ROUTER = {
    AUTH: 'auth',
    OAUTH: 'oauth',
    ROLE: 'role',
    ROLE_PERMISSION: 'role-permission',
    PERMISSION: 'permission',

    EMPLOYEE: 'employee',

    CLIENT: 'client',

    SERVICE: 'service',
    PRODUCT: 'product',
    TRACKING: 'tracking',
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
