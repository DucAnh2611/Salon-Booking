import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { mkdir, readFile, stat, unlink, writeFile } from 'fs/promises';
import * as mime from 'mime-types';
import { extname, join } from 'path';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { FileFormatEnum } from '../../common/enum/files.enum';
import { multerBaseDir, multerConfig } from '../../config/multer.configs';
import { BadRequest, InternalServer } from '../../shared/exception/error.exception';
import { CreateTempMediaDto } from './dto/media-create.dto';
import { MediaUpdateDto } from './dto/media-update.dto';
import { MediaEntity } from './entity/media.entity';
import { MediaTypesEnum } from './enum/media-types.enum';
import { TSaveMutipleMedia } from './type/media-save.type';

@Injectable()
export class MediaService {
    constructor(@InjectRepository(MediaEntity) private readonly mediaRepository: Repository<MediaEntity>) {}

    isValid(id: string) {
        return this.mediaRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    fileType(file: Express.Multer.File) {
        const { image, video } = multerConfig.acceptedFile;
        let type = '';

        const sample = {
            [MediaTypesEnum.IMAGE]: image,
            [MediaTypesEnum.VIDEO]: video,
        };

        Object.entries(sample).forEach(([kind, list]: [kind: MediaTypesEnum, list: string[]]) => {
            const isMatch = list.includes(extname(file.originalname).replace('.', ''));
            if (isMatch) {
                type = kind;
            }
        });

        return type;
    }

    async isValidWithType(id: string, type: MediaTypesEnum) {
        const image = await this.isValid(id);

        if (!image) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_IMAGE });
        } else if (image.type !== type) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_MEDIA_TYPE });
        }

        return image;
    }

    async isMatchType(file: Express.Multer.File, type: MediaTypesEnum) {
        const listAccepted = multerConfig.acceptedFile[type.toLocaleLowerCase()];
        return listAccepted.includes(extname(file.originalname).replace('.', ''));
    }

    async getMedia(mediaId: string) {
        const getMediaInfo = await this.mediaRepository.findOneBy({ id: mediaId });

        if (!getMediaInfo) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_IMAGE });
        }

        const { file } = await this.getMediaFromPath(getMediaInfo.path);

        return file;
    }

    async getMediaFromPath(path: string) {
        const fullPath = join(multerBaseDir, path);
        try {
            const fileStats = await stat(fullPath);
            if (!fileStats) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_IMAGE });
            }
            const fileBuffer = await readFile(fullPath);

            const mimetype = mime.lookup(fullPath);
            if (!mimetype) {
                throw new InternalServer();
            }

            const file: Express.Multer.File = {
                buffer: fileBuffer,
                originalname: path.split('/').pop() || '',
                encoding: '7bit',
                mimetype: mimetype,
                size: fileStats.size,
                destination: '',
                filename: path.split('/').pop() || '',
                path: fullPath,
                fieldname: '',
                stream: null,
            };

            return { path: fullPath, file };
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_IMAGE });
            }
            return null;
        }
    }

    async saveMutiples(userId: string, medias: TSaveMutipleMedia[]) {
        const saves = await Promise.all(
            medias.map(media => this.save(userId, media.file, media.path, media.fileName || media.file.filename)),
        );
        return saves;
    }

    async save(userId: string, file: Express.Multer.File, path: string, newFileName: string) {
        const fileName = file.filename;
        const getMedia = await this.getTempMedia(fileName);
        const newNameWithExt = `${newFileName}${extname(file.originalname)}`;

        const [deletedTemp, savedMulter] = await Promise.all([
            this.deleteTempMedia(fileName),
            this.saveMedia(path, newNameWithExt, getMedia),
        ]);

        if (!deletedTemp || !savedMulter) {
            throw new InternalServer();
        }

        const { image } = multerConfig.acceptedFile;
        const fileType = image.includes(extname(savedMulter).replace('.', ''))
            ? MediaTypesEnum.IMAGE
            : MediaTypesEnum.VIDEO;

        const mediaInstance = this.mediaRepository.create({
            title: newFileName,
            path: savedMulter,
            type: fileType,
            createdBy: userId,
            updatedBy: userId,
        });
        const savedMedia = await this.mediaRepository.save(mediaInstance);

        return savedMedia;
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

    async delete(userId: string, mediaId: string) {
        const getMediaInfo = await this.mediaRepository.findOneBy({ id: mediaId });

        if (!getMediaInfo) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_IMAGE });
        }

        const [deleteDb, updatedUser, deleteMulter] = await Promise.all([
            this.mediaRepository.softDelete({ id: mediaId }),
            this.mediaRepository.save({ id: mediaId, updatedBy: userId }),
            unlink(getMediaInfo.path),
        ]);

        return deleteDb && deleteMulter;
    }

    getImagePath(image: string) {
        return [multerBaseDir, image].join('/');
    }

    async saveMedia(path: string, filename: string, file: Express.Multer.File) {
        const valid = await this.ensureDirectoryExists(join(multerBaseDir, path));
        if (valid) {
            const pathName = join(multerBaseDir, path, filename);
            await writeFile(pathName, file.buffer);

            return pathName.replace(new RegExp(`^.*?\\\\${multerConfig.dest}\\\\`, 'g'), ``).replace(/\\/g, '/');
        }
        return null;
    }

    async saveToTemp(file: Express.Multer.File, tempFileCreate: CreateTempMediaDto) {
        const { context, sessionId } = tempFileCreate;
        const tempFile = await this.getTempMedia(file.filename);
        if (!tempFile) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_MEDIA });
        }

        const fileType = this.fileType(file);
        const fileName = multerConfig.format.temp
            .replace(FileFormatEnum.MEDIA_TYPE, fileType)
            .replace(FileFormatEnum.CONTEXT, context)
            .replace(FileFormatEnum.SESSION_ID, sessionId);

        const newNameWithExt = `${fileName}${extname(file.originalname)}`;

        const [tempUrl, _] = await Promise.all([
            this.saveMedia(multerConfig.temp, newNameWithExt, tempFile),
            this.deleteTempMedia(file.filename),
        ]);

        return { url: tempUrl, context, sessionId };
    }

    async findImage(image: string) {
        const imagePath = this.getImagePath(image);
        const imageExists = await stat(imagePath);
        if (!imageExists) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST });
        }

        return imageExists;
    }

    async getTempMedia(mediaName: string) {
        const filePath = join(multerBaseDir, multerConfig.temp, mediaName);
        const fileBuffer = await readFile(filePath);

        const mimetype = mime.lookup(filePath);
        if (!mimetype) {
            throw new InternalServer();
        }

        const file: Express.Multer.File = {
            buffer: fileBuffer,
            originalname: mediaName,
            mimetype: mimetype,
            size: fileBuffer.length,
            destination: '',
            filename: '',
            path: filePath,
            fieldname: '',
            encoding: '7bit',
            stream: null,
        };

        return file;
    }

    async deleteTempMedia(imageName: string) {
        try {
            await unlink(join(multerBaseDir, multerConfig.temp, imageName));
            return true;
        } catch (e) {
            return false;
        }
    }

    async ensureDirectoryExists(filePath: string): Promise<boolean> {
        try {
            await mkdir(filePath, { recursive: true });
            return true;
        } catch (error) {
            return false;
        }
    }
}
