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

export const THIRD_PARTY_VN_PUBLIC_API = {
    LIST_PROVINCE: 'provinces/getAll',
    SEARCH_PROVINCE: 'provinces/getAll',
    GET_PROVINCE: 'provinces/:code',

    LIST_DISTRICT: 'districts/getAll',
    SEARCH_DISTRICT: 'district/getByProvince/',
    GET_DISTRICT: 'district/:code',

    LIST_WARD: 'w',
    SEARCH_WARD: 'w/search/',
    GET_WARD: 'w/:code',
};

export const THIRD_PARTY_VIETQR = {
    BANKS: 'banks',
    QUICK_QR: 'generate',
};

export const THIRD_PARTY_SEPAY = {
    PAYMENT_QR: 'img',
    TRANSACTION_LIST: 'userapi/transactions/list',
};
