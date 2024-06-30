import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { mkdir, readFile, stat, unlink, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { multerBaseDir, multerConfig } from '../../config/multer.configs';
import { BadRequest, InternalServer } from '../../shared/exception/error.exception';
import { MediaUpdateDto } from './dto/media-update.dto';
import { MediaEntity } from './entity/media.entity';
import { MediaTypesEnum } from './enum/media-types.enum';
import { TSaveMutipleMedia } from './type/media-save.type';

@Injectable()
export class MediaService {
    constructor(@InjectRepository(MediaEntity) private readonly mediaRepository: Repository<MediaEntity>) {}

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

            const fileExtension = extname(path).toLowerCase();
            let contentType = 'application/octet-stream';

            if (multerConfig.acceptedFile.image.includes(fileExtension)) {
                contentType = `image/${fileExtension.slice(1)}`;
            } else if (multerConfig.acceptedFile.video.includes(fileExtension)) {
                contentType = `video/${fileExtension.slice(1)}`;
            }
            const fileBuffer = await readFile(fullPath);
            const file: Express.Multer.File = {
                buffer: fileBuffer,
                originalname: path.split('/').pop() || '',
                encoding: '7bit',
                mimetype: contentType,
                size: fileStats.size,
                destination: '',
                filename: '',
                path: fullPath,
                fieldname: '',
                stream: null,
            };

            return { path: fullPath, contentType, file };
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_IMAGE });
            }
            throw error;
        }
    }

    async saveMutiples(userId: string, medias: TSaveMutipleMedia[]) {
        const saves = await Promise.all(
            medias.map(media => this.save(userId, media.file, media.path, media.fileName || media.file.filename)),
        );
        return saves;
    }

    async save(userId: string, file: Express.Multer.File, path: string, newFileName: string) {
        if (!userId) {
            throw new BadRequest({ message: DataErrorCodeEnum.MISSING_DATA });
        }

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
        const pathUploads = savedMulter
            .replace(new RegExp(`^.*?\\\\${multerConfig.dest}\\\\`, 'g'), `${multerConfig.dest}/`)
            .replace(/\\/g, '/');

        const { image } = multerConfig.acceptedFile;
        const fileType = image.includes(extname(pathUploads)) ? MediaTypesEnum.IMAGE : MediaTypesEnum.VIDEO;

        const mediaInstance = this.mediaRepository.create({
            title: newFileName,
            path: pathUploads,
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
        const valid = await this.ensureDirectoryExists(join(path));
        if (valid) {
            const pathName = join(path, filename);
            await writeFile(pathName, file.buffer);

            return pathName;
        }
        return null;
    }

    async findImage(image: string) {
        const imagePath = this.getImagePath(image);
        const imageExists = await stat(imagePath);
        if (!imageExists) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST });
        }

        return imageExists;
    }

    async getTempMedia(imageName: string) {
        const filePath = join(multerBaseDir, multerConfig.temp, imageName);
        const fileBuffer = await readFile(filePath);
        const file: Express.Multer.File = {
            buffer: fileBuffer,
            originalname: imageName,
            mimetype: 'image/jpeg',
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
