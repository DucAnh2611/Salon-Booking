import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { MEDIA_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { MediaService } from './media.service';

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
}
