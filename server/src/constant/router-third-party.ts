export const THIRD_PARTY_OPEN_PROVINCE = {
    LIST_PROVINCE: 'p',
    SEARCH_PROVINCE: 'p/search/',
    GET_PROVINCE: 'p/:code',

    LIST_DISTRICT: 'd',
    SEARCH_DISTRICT: 'd/search/',
    GET_DISTRICT: 'd/:code',

    LIST_WARD: 'w',
    SEARCH_WARD: 'w/search/',
    GET_WARD: 'w/:code',
};

export const THIRD_PARTY_BACKUP_PROVINCE = {
    LIST_PROVINCE: 'location/provinces?size=63',
    SEARCH_PROVINCE: 'location/provinces',
    GET_PROVINCE: 'location/provinces',

    LIST_DISTRICT: 'location/districts?size=100&provinceId=:code',
    SEARCH_DISTRICT: 'location/district?size=100',
    GET_DISTRICT: 'location/district/:code',

    LIST_WARD: 'location/wards?size=100&districtId=:code',
    SEARCH_WARD: 'location/w/search/',
    GET_WARD: 'location/w/:code',
};

export const THIRD_PARTY_VIETQR = {
    BANKS: 'banks',
    QUICK_QR: 'generate',
};

export const THIRD_PARTY_SEPAY = {
    PAYMENT_QR: 'img',
    TRANSACTION_LIST: 'userapi/transactions/list',
};
