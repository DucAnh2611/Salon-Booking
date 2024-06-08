export const ROUTER = {
    AUTH: 'auth',
    ROLE: 'role',
    ROLE_PERMISSION: 'role-permission',
    PERMISSION: 'permission',

    EMPLOYEE: 'employee',
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
