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
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FORMDATA_FIELD_MEDIA } from '../../../common/constant/file.constants';
import { CATEGORY_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { multerConfig, multerOptions } from '../../../config/multer.configs';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { MediaService } from '../../media/service/media.service';
import { CategoryService } from '../category.service';
import { CreateCategoryDto } from '../dto/category-create.dto';
import { DeleteManyCategoryDto } from '../dto/category-delete.dto';
import { FindCategoryAdminDto, GetParamCategoryDto } from '../dto/category-get.dto';
import { UpdateCategoryDto } from '../dto/category-update.dto';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.CATEGORY)
export class CategoryAdminController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly mediaService: MediaService,
    ) {}

    @Get(CATEGORY_ROUTE.FIND)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.CATEGORY,
            action: [PermissionActionEnum.READ],
        },
    ])
    find(@Query() query: FindCategoryAdminDto) {
        return this.categoryService.findAdmin(query);
    }

    @Post(CATEGORY_ROUTE.CREATE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.CATEGORY,
            action: [PermissionActionEnum.CREATE],
        },
    ])
    @UseInterceptors(FileInterceptor(FORMDATA_FIELD_MEDIA.IMAGE, multerOptions))
    async add(@Req() req: AppRequest, @Body() body: CreateCategoryDto, @UploadedFile() file?: Express.Multer.File) {
        const { employeeId, userId } = req.accessPayload;

        if (file) {
            const saveImage = await this.mediaService.save(userId, file, multerConfig.category);
            body.imageId = saveImage.id;
        }

        return this.categoryService.create(employeeId, body);
    }

    @Put(CATEGORY_ROUTE.UPDATE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.CATEGORY, action: [PermissionActionEnum.UPDATE] }])
    @UseInterceptors(FileInterceptor(FORMDATA_FIELD_MEDIA.IMAGE, multerOptions))
    async update(
        @Req() req: AppRequest,
        @Param() param: GetParamCategoryDto,
        @Body() body: UpdateCategoryDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const { id: categoryId } = param;
        const { employeeId, userId } = req.accessPayload;

        if (file) {
            const saveImage = await this.mediaService.save(userId, file, multerConfig.category);
            body.imageId = saveImage.id;
        }

        return this.categoryService.update(employeeId, categoryId, body);
    }

    @Delete(CATEGORY_ROUTE.DELETE_ONE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.CATEGORY, action: [PermissionActionEnum.DELETE] }])
    @UserType(UserTypeEnum.STAFF)
    deleteOne(@Req() req: AppRequest, @Param() param: GetParamCategoryDto) {
        const { id: categoryId } = param;
        const { employeeId } = req.accessPayload;

        return this.categoryService.delete(employeeId, categoryId);
    }

    @Delete(CATEGORY_ROUTE.DELETE_MANY)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.CATEGORY, action: [PermissionActionEnum.DELETE] }])
    @UserType(UserTypeEnum.STAFF)
    deleteMany(@Req() req: AppRequest, @Body() body: DeleteManyCategoryDto) {
        const { ids: categoryIds } = body;
        const { employeeId } = req.accessPayload;

        return this.categoryService.deleteMany(employeeId, categoryIds);
    }
}
