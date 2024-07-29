import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { MEDIA_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { multerOptions } from '../../../config/multer.configs';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { CreateTempMediaDto } from '../dto/media-create.dto';
import { MediaService } from '../service/media.service';

@Controller(ROUTER.MEDIA)
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Get(MEDIA_ROUTE.GET_MEDIA)
    async getImage(@Param('0') restOfPath: string, @Res() res: Response) {
        const { file, path } = await this.mediaService.getMediaFromPath(restOfPath);

        res.setHeader('Content-Type', file.mimetype);
        res.setHeader('Content-Length', file.size);

        const readStream = createReadStream(path);
        readStream.pipe(res);
    }

    @Post(MEDIA_ROUTE.TEMP_UPLOAD)
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(FileInterceptor('file', multerOptions))
    tempUpload(@UploadedFile() file: Express.Multer.File, @Body() body: CreateTempMediaDto) {
        return this.mediaService.saveToTemp(file, body);
    }
}
