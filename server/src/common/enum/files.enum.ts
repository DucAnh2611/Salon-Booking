export enum FileUnitEnum {
    GB = 'GB',
    MB = 'MB',
    KB = 'KB',
    B = 'B',
}

export const FILE_UNIT = {
    GB: FileUnitEnum.GB,
    MB: FileUnitEnum.MB,
    KB: FileUnitEnum.KB,
    B: FileUnitEnum.B,
};

export enum FileFormatEnum {
    USER_ID = '<USER_ID>',
    MEDIA_NAME = '<MEDIA_NAME>',
    SERVICE_ID = '<SERVICE_ID>',
    MEDIA_TYPE = '<MEDIA_TYPE>',
    PRODUCT_ID = '<PRODUCT_ID>',
    CLIENT_ID = '<CLIENT_ID>',
    STAFF_ID = '<STAFF_ID>',
    ORDER_ID = '<ORDER_ID>',
    TYPE_ID = '<TYPE_ID>',
    ATTRIBUTE_ID = '<ATTRIBUTE_ID>',
    PRODUCT_BASE_ID = '<PRODUCT_BASE_ID>',
    SESSION_ID = '<SESSION_ID>',
    CONTEXT = '<CONTEXT>',
}
