import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../../common/enum/data-success-code.enum';
import { SortByEnum } from '../../../common/enum/query.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { multerConfig } from '../../../config/multer.configs';
import { BadRequest } from '../../../shared/exception/error.exception';
import { ParseOrderString } from '../../../shared/utils/parse-dynamic-queyry.utils';
import { DeleteMediaDto } from '../dto/media-delete.dto';
import { FindMediaAdminQuery } from '../dto/media-get.dto';
import { MediaUpdateDto } from '../dto/media-update.dto';
import { MediaEntity } from '../entity/media.entity';
import { MediaTypesEnum } from '../enum/media-types.enum';
import { MediaService } from './media.service';

@Injectable()
export class MediaAdminService {
    constructor(
        @InjectRepository(MediaEntity) private readonly mediaRepository: Repository<MediaEntity>,
        private readonly mediaService: MediaService,
    ) {}

    async uploads(userId: string, files: Express.Multer.File[]) {
        const saves = await this.mediaService.saveMutiples(
            userId,
            files.map(file => ({ file, path: multerConfig.common })),
        );

        return saves;
    }

    async find(query: FindMediaAdminQuery) {
        const { key = '', limit, orderBy, page, type } = query;

        const order = orderBy ? ParseOrderString(orderBy) : { createdAt: SortByEnum.ASC };
        const [items, count] = await this.mediaRepository.findAndCount({
            where: {
                title: Like(`%${key}%`),
                type: type ? type : In(Object.values(MediaTypesEnum).map(v => v)),
                userCreate: {
                    type: UserTypeEnum.STAFF,
                },
                userUpdate: {
                    type: UserTypeEnum.STAFF,
                },
            },
            order: { ...order },
            take: limit,
            skip: (page - 1) * limit,
            loadEagerRelations: false,
            relations: {
                userAvatar: true,
                userCreate: {
                    employee: true,
                },
                userUpdate: {
                    employee: true,
                },
            },
        });

        return {
            items,
            count,
            page,
            limit,
        };
    }

    async update(userId: string, mediaId: string, newMedia: MediaUpdateDto) {
        const getMediaInfo = await this.mediaRepository.findOneBy({ id: mediaId });

        if (!getMediaInfo) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_IMAGE });
        }

        const newMediaInfo: MediaEntity = {
            ...getMediaInfo,
            ...newMedia,
            updatedBy: userId,
        };

        const updatedMedia = await this.mediaRepository.save(newMediaInfo);

        return updatedMedia;
    }

    async delete(body: DeleteMediaDto) {
        const { ids } = body;

        const getMediaInfo = await this.mediaRepository.find({ where: { id: In(ids) }, loadEagerRelations: false });

        if (getMediaInfo.length !== ids.length) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_IMAGE });
        }

        const deleteMedia = await this.mediaRepository.softDelete({ id: In(ids) });

        return DataSuccessCodeEnum.OK;
    }

    // @Cron(CronExpression.EVERY_MINUTE)
    // async deleteExpiredFiles() {
    //     const files = await readdir(multerBaseDir + '/' + multerConfig.temp);

    //     const currentTime = Date.now();

    //     console.log('===== DELETED EXPIRED TEMP FILE START =====');

    //     let count = 0;
    //     if (files.length) {
    //         files.forEach(async (file: string) => {
    //             const filePath = path.join(multerBaseDir + '/' + multerConfig.temp, file);
    //             const fileParts = file.split('_');

    //             if (fileParts.length >= 2) {
    //                 const sessionExpireTime = parseInt(fileParts[1], 10);

    //                 if (!isNaN(sessionExpireTime) && sessionExpireTime < currentTime) {
    //                     await unlink(filePath);
    //                     count++;
    //                 }
    //             }
    //         });
    //     }

    //     console.log(`Deleted: ${count} temps files`);
    //     console.log('===== DELETED EXPIRED TEMP FILE END =====');
    // }
}
