import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { DataErrorCodeEnum } from '../common/enum/data-error-code.enum';
import { FILE_UNIT } from '../common/enum/files.enum';
import { BadRequest } from '../shared/exception/error.exception';
import { convertToBytes } from '../shared/utils/file.utils';
import { appConfig } from './app.config';

export const multerBaseDir = appConfig.baseDir + process.env.MULTER_DEST;

export const multerConfig = {
    dest: process.env.MULTER_DEST,
    client: process.env.MULTER_CLIENT_DEST,
    temp: process.env.MULTER_TEMP_DEST,
    user: process.env.MULTER_USER_DEST,
    service: process.env.MULTER_SERVICE_DEST,
    product: { base: process.env.MULTER_PRODUCT_DEST, typesAttribute: process.env.MULTER_PRODUCT_TYPES_ATTRIBUTE_DEST },
    staff: process.env.MULTER_STAFF_DEST,
    rate: process.env.MULTER_RATE_DEST,
    category: process.env.MULTER_CATEGORY_DEST,
    voucher: process.env.MULTER_VOUCHER_DEST,
    common: process.env.MULTER_COMMON_DEST,
    organization: process.env.MULTER_TEMP_ORGANIZATION,
    order: {
        base: process.env.MULTER_ORDER_DEST,
        refund: process.env.MULTER_ORDER_REFUND,
    },
    format: {
        user: {
            avatar: 'user_avatar_<USER_ID>_<MEDIA_TYPE>',
        },
        service: {
            base: 'service_<SERVICE_ID>_<MEDIA_TYPE>',
        },
        product: {
            base: 'product_<PRODUCT_ID>_<MEDIA_TYPE>',
            typesAttribute: 'product_types_attribute_<PRODUCT_ID>_<TYPE_ID>_<ATTRIBUTE_ID>_<MEDIA_TYPE>',
        },
        staff: { avatar: 'staff_avatar_<STAFF_ID>' },
        rate: 'rating_<MEDIA_TYPE>_<ORDER_ID>_<CLIENT_ID>',
        category: 'category_<STAFF_ID>_<MEDIA_TYPE>',
        voucher: 'voucher_<STAFF_ID>_<MEDIA_TYPE>',
        temp: '<SESSION_ID>_<SESSION_EXPIRE>_<CONTEXT>_<MEDIA_TYPE>',
    },
    maxSize: {
        size: 10,
        unit: FILE_UNIT.MB,
    },
    maxFile: 10,
    acceptedFile: {
        image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
        video: ['mp4', 'mov', 'avi', 'mkv', 'flv', 'webm'],
    },
};

export const multerOptions: MulterOptions = {
    storage: diskStorage({
        destination: join(multerBaseDir, multerConfig.temp),
        filename: (req: Request, file: Express.Multer.File, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
    }),
    fileFilter: (req: Request, file: Express.Multer.File, cb: (error: any | null, acceptFile: boolean) => void) => {
        const allowedMimeTypes = [
            ...multerConfig.acceptedFile.image.map(type => `image/${type}`),
            ...multerConfig.acceptedFile.video.map(type => `video/${type}`),
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new BadRequest({ message: DataErrorCodeEnum.INVALID_FILE_TYPE }), false);
        }
    },
    limits: {
        fileSize: convertToBytes(multerConfig.maxSize.size, multerConfig.maxSize.unit),
        files: multerConfig.maxFile,
    },
};
