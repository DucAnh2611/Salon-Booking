import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerBaseDir } from '../../config/multer.configs';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from './entity/media.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MediaEntity]),
        MulterModule.register({
            dest: multerBaseDir,
        }),
    ],
    controllers: [MediaController],
    providers: [MediaService],
    exports: [MediaService],
})
export class MediaModule {}
