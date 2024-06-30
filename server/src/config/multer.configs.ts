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
    temp: process.env.MULTER_TEMP_DEST,
    user: process.env.MULTER_USER_DEST,
    service: process.env.MULTER_SERVICE_DEST,
    product: process.env.MULTER_PRODUCT_DEST,
    staff: process.env.MULTER_STAFF_DEST,
    rate: process.env.MULTER_RATE_DEST,
    category: process.env.MULTER_CATEGORY_DEST,
    format: {
        user: {
            avatar: 'user_avatar_<USER_ID>_<MEDIA_TYPE>',
        },
        service: 'service_<SERVICE_ID>_<MEDIA_TYPE>',
        product: 'product_<PRODUCT_ID>_<MEDIA_TYPE>',
        staff: { avatar: 'staff_avatar_<STAFF_ID>' },
        rate: 'rating_<MEDIA_TYPE>_<ORDER_ID>_<USER_ID>',
        category: 'category_<USER_ID>_<MEDIA_TYPE>',
    },
    maxSize: {
        size: 5,
        unit: FILE_UNIT.MB,
    },
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
    limits: { fileSize: convertToBytes(multerConfig.maxSize.size, multerConfig.maxSize.unit) },
};
