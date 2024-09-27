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
import { FORMDATA_FIELD_MEDIA } from '../../../common/constant/file.constants';
import { MEDIA_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { multerConfig, multerOptions } from '../../../config/multer.configs';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
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
