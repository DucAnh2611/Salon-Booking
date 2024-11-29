import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig, multerOptions } from '../../../config/multer.configs';
import { FORMDATA_FIELD_MEDIA } from '../../../constant/file.constants';
import { MEDIA_ROUTE, ROUTER } from '../../../constant/router.constant';
import { TargetActionRequire } from '../../../decorator/permission.decorator';
import { UserType } from '../../../decorator/user-types.decorator';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../enum/permission.enum';
import { UserTypeEnum } from '../../../enum/user.enum';
import { AccessTokenGuard } from '../../../guard/accessToken.guard';
import { PermissionGuard } from '../../../guard/permission.guard';
import { UserTypeGuard } from '../../../guard/user-type.guard';
import { AppRequest } from '../../../interface/custom-request.interface';
import { DeleteMediaDto } from '../dto/media-delete.dto';
import { FindMediaAdminQuery, GetMediaParamDto } from '../dto/media-get.dto';
import { MediaUpdateDto } from '../dto/media-update.dto';
import { MediaAdminService } from '../service/media-admin.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.MEDIA)
export class MediaAdminController {
    constructor(private readonly mediaService: MediaAdminService) {}

    @Get(MEDIA_ROUTE.FIND)
    @TargetActionRequire([{ target: PermissionTargetEnum.MEDIA, action: [PermissionActionEnum.READ] }])
    @UserType(UserTypeEnum.STAFF)
    list(@Query() query: FindMediaAdminQuery) {
        return this.mediaService.find(query);
    }

    @Post(MEDIA_ROUTE.UPLOAD)
    @TargetActionRequire([{ target: PermissionTargetEnum.MEDIA, action: [PermissionActionEnum.CREATE] }])
    @UserType(UserTypeEnum.STAFF)
    @UseInterceptors(FilesInterceptor(FORMDATA_FIELD_MEDIA.MEDIAS, multerConfig.maxFile, multerOptions))
    uploads(@Req() req: AppRequest, @UploadedFiles() files: Express.Multer.File[]) {
        const { userId } = req.accessPayload;
        return this.mediaService.uploads(userId, files);
    }

    @Put(MEDIA_ROUTE.UPDATE)
    @TargetActionRequire([{ target: PermissionTargetEnum.MEDIA, action: [PermissionActionEnum.UPDATE] }])
    @UserType(UserTypeEnum.STAFF)
    update(@Req() req: AppRequest, @Param() param: GetMediaParamDto, @Body() body: MediaUpdateDto) {
        const { userId } = req.accessPayload;
        const { id: mediaId } = param;

        return this.mediaService.update(userId, mediaId, body);
    }

    @Delete(MEDIA_ROUTE.DELETE)
    @TargetActionRequire([{ target: PermissionTargetEnum.MEDIA, action: [PermissionActionEnum.UPDATE] }])
    @UserType(UserTypeEnum.STAFF)
    delete(@Req() req: AppRequest, @Body() body: DeleteMediaDto) {
        return this.mediaService.delete(body);
    }
}
