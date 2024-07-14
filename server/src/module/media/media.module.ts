import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { multerBaseDir } from '../../config/multer.configs';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { MediaEntity } from './entity/media.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([MediaEntity]),
        MulterModule.register({
            dest: multerBaseDir,
        }),
    ],
    controllers: [MediaController],
    providers: [MediaService, AccessTokenGuard],
    exports: [MediaService],
})
export class MediaModule {}
