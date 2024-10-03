export enum DataErrorCodeEnum {
    // Internal error
    INTERNAL = 'DE999',

    // Action errors
    CAN_NOT_DO_ACTION = 'DE001',

    // Verification errors
    EMAIL_ALREADY_VERIFIED = 'DE002',

    // Existence errors
    EXIST = 'DE003',
    EXISTED_VOUCHER = 'DE004',
    EXISTED_USERNAME = 'DE005',
    EXISTED_PRODUCT_DETAIL_KEY = 'DE006',
    EXISTED_PRODUCT = 'DE007',
    EXISTED_PRODUCT_TYPE = 'DE008',
    EXISTED_SERVICE = 'DE009',
    EXISTED_SERVICE_STEP = 'DE010',
    EXISTED_WORKING_HOUR = 'DE011',
    EXISTED_PRODUCT_CART_ITEM = 'DE012',

    // Nonexistence errors
    NOT_EXIST = 'DE013',
    NOT_EXIST_CATEGORY = 'DE014',
    NOT_EXIST_IMAGE = 'DE015',
    NOT_EXIST_VOUCHER = 'DE016',
    NOT_EXIST_EMPLOYEE = 'DE017',
    NOT_EXIST_USER = 'DE018',
    NOT_EXIST_ATTRIBUTE = 'DE019',
    NOT_EXIST_PRODUCT = 'DE020',
    NOT_EXIST_PRODUCT_TYPE = 'DE021',
    NOT_EXIST_MEDIA = 'DE022',
    NOT_EXIST_PRODUCT_DETAIL_KEY = 'DE023',
    NOT_EXIST_ROLE = 'DE024',
    NOT_EXIST_ROLE_PERMISSION = 'DE025',
    NOT_EXIST_PERMISSION = 'DE026',
    NOT_EXIST_SERVICE_PARENT = 'DE027',
    NOT_EXIST_SERVICE = 'DE028',
    NOT_EXIST_SERVICE_STEP = 'DE029',
    NOT_EXIST_SERVICE_EMPLOYEE = 'DE030',
    NOT_EXIST_WORKING_HOUR = 'DE031',
    NOT_EXIST_SHIFT_ASSIGNMENT = 'DE032',
    NOT_EXIST_SHIFT = 'DE033',
    NOT_EXIST_CART = 'DE034',
    NOT_EXIST_PRODUCT_CART = 'DE035',
    NOT_EXIST_SERVICE_CART = 'DE036',
    NOT_EXIST_PRODUCT_CART_ITEM = 'DE037',
    NOT_EXIST_SERVICE_CART_ITEM = 'DE038',
    NOT_EXIST_ORDER = 'DE081',

    // Invalid input errors
    INVALID_ATTRIBUTE_VALUE = 'DE039',
    INVALID_CLIENT_ROLE = 'DE040',
    INVALID_EMAIL = 'DE041',
    INVALID_END_TIME = 'DE042',
    INVALID_FILE = 'DE043',
    INVALID_FILE_TYPE = 'DE044',
    INVALID_OTP = 'DE045',
    INVALID_ROLE = 'DE046',
    INVALID_STAFF_ROLE = 'DE047',
    INVALID_TOKEN = 'DE048',
    INVALID_USER_ROLE = 'DE049',
    INVALID_USER_TYPE = 'DE050',
    INVALID_MEDIA_TYPE = 'DE051',
    INVALID_SERVICE_STEP_LEVEL = 'DE052',
    INVALID_TIME_RANGE = 'DE053',
    INVALID_SHIFT_TIMES = 'DE054',
    INVALID_SERVICE_EMPLOYEE = 'DE079',
    INVALID_TIME_FORMAT = 'DE083',

    // Missing data errors
    MISSING_DATA = 'DE055',
    NO_OTP_TOKEN = 'DE056',
    MISSING_THUMBNAIL = 'DE057',

    // OTP errors
    OTP_EXPIRED = 'DE058',
    OTP_NOT_MATCH = 'DE059',

    // Format errors
    WRONG_FORMAT = 'DE060',
    WRONG_PASSWORD = 'DE061',

    EXPIRED_VOUCHER = 'DE062',
    OUT_OF_USAGE_VOUCHER = 'DE063',

    // Attributes
    ATTRIBUTE_SAME_LEVEL = 'DE064',

    // Working Hour
    NOT_SAME_DAY = 'DE065',
    NEGATIVE_DATE = 'DE066',
    ASSIGNMENT_NOT_BELONG = 'DE067',
    SHIFT_OUTSIDE_WORKING_HOURS = 'DE068',
    BOOKING_TIME_OUTSIDE_SHIFT = 'DE069',
    OVERLAPPING_SHIFTS = 'DE070',
    SHIFT_STARTED = 'DE071',
    EMPLOYEE_NOT_IN_SHIFT = 'DE072',

    // Cart
    NOT_OWN_CART = 'DE073',
    TYPES_NOT_MATCH = 'DE074',
    NO_ACTIVE_CART = 'DE075',
    SERVICE_ADDED = 'DE076',
    SERVICE_NOT_ADDED = 'DE077',
    PRODUCT_TYPE_REQUIRE = 'DE078',
    NO_ORDER_ITEM = 'DE080',

    // Order
    ORDER_FORBIDDEN = 'DE082',
    PRODUCT_OUT_OF_STOCK = 'DE084',
    PRODUCT_TYPES_OUT_OF_STOCK = 'DE085',

    SELF_LINK_CATEGORY = 'DE086',
    NESTED_CATEGORY = 'DE087',
    NOT_EXIST_PARENT_ROLE = 'DE088',
    CONTAIN_ROLE_UNDELETEABLE = 'DE089',
    NESTED_ROLE = 'DE090',
    SELF_LINK_ROLE = 'DE091',
    UNMODIFIABLE_ROLE = 'DE092',
    PARENT_ROLE_CAN_NOT_HIGHER_THAN_STAFF = 'DE093',
    SELF_DELETE_EMPLOYEE = 'DE094',
    DELETE_ADMIN = 'DE095',
    CAN_NOT_CHANGE_ADMIN_ROLE = 'DE096',
    EXISTED_PRODUCT_BY_SKU = 'DE097',
    WORKING_HOUR_START = 'DE098',
    MAXIMUM_ORDER_STATE_REACH = 'DE099',
    ORDER_STATE_EXIST = 'DE100',
    INVALID_ORDER_STATE = 'DE101',
    NOT_EXIST_CLIENT = 'DE102',
    CAN_NOT_CANCEL_ORDER = 'DE103',
    ORDER_PAYMENT_TYPE_IS_NOT_BANK = 'DE104',
    ORDER_IS_NOT_PAID = 'DE105',
    ORDER_PAID = 'DE106',
    MISSING_ORDER_REFUND_BANK_INFO = 'DE107',
    NOT_EXIST_ORDER_TRANSACTION = 'DE108',
    NOT_EXIST_PAYMENT_TRANSACTION = 'DE109',
    REFUND_REQUEST_MUST_APPROVED = 'DE110',
    REFUND_REQUEST_MUST_BE_PENDING = 'DE111',
    EXISTED_CLIENT = 'DE112',
    NOT_EXISTE_TYPE_ATTRIBUTE_VALUE = 'DE113',
    SAME_SKU = 'DE114',
    PRODUCT_CART_ITEM_NOT_MATCH = 'DE115',
    FULFULLED_PAID_AMOUNT = 'DE116',
    PAYMENT_PROCESSED = 'DE117',
    REFUND_REQUEST_IS_PROCESSING = 'DE118',

    INVALID_ACCESS_TOKEN = 'DE119',
    INVALID_REFRESH_TOKEN = 'DE120',

    NOT_EXIST_REFUND_REQUEST = 'DE121',
    EMPLOYEE_IS_NOT_AVAILABLE = 'DE122',
    OVERLAP_SERVICE_EMPLOYEE = 'DE123',
    APPROVED_REFUND_REQUEST = 'DE124',

    ACCOUNT_LOCK = 'DE125',
    ORDER_LOCK = 'DE126',
    EXIST_EMAIL_OR_PHONE = 'DE127',

    DUPLICATE_PHONE_EMPLOYEE = 'DE128',
    DUPLICATE_USERNAME_EMPLOYEE = 'DE129',

    WORKING_DATE_OVERLAP_SHIFT = 'DE130',

    NOT_EXIST_ORGANIZATION = 'DE131',
    NO_SHOW_ORGANIZATION = 'DE132',
}
