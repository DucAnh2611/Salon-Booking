export const ROUTER = {
    AUTH: 'auth',
    ROLE: 'role',
    ROLE_PERMISSION: 'role-permission',
};

export const AUTH_ROUTE = {
    EMP_LOGIN: 'emp-login',
    EMP_REGISTER: 'emp-register',

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
    ROLE_PERMISISON_UPDATE: ':roleId',
    DELETE: ':roleId',
};
