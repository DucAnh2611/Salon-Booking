import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { multerBaseDir } from '../../config/multer.configs';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { MediaAdminController } from './controller/media-admin.controller';
import { MediaController } from './controller/media.controller';
import { MediaEntity } from './entity/media.entity';
import { MediaAdminService } from './service/media-admin.service';
import { MediaService } from './service/media.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([MediaEntity]),
        MulterModule.register({
            dest: multerBaseDir,
        }),
        RoleModule,
        RolePermissionModule,
    ],
    controllers: [MediaAdminController, MediaController],
    providers: [MediaService, MediaAdminService],
    exports: [MediaService],
})
export class MediaModule {}
