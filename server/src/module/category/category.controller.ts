import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FORMDATA_FIELD_MEDIA } from '../../common/constant/file.constants';
import { ROLE_TITLE } from '../../common/constant/role.constant';
import { CATEGORY_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { FileFormatEnum } from '../../common/enum/files.enum';
import { PermissionActionEnum, PermissionTargetEnum } from '../../common/enum/permission.enum';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { DynamicQuery } from '../../common/type/query.type';
import { multerConfig, multerOptions } from '../../config/multer.configs';
import { TargetActionRequire } from '../../shared/decorator/permission.decorator';
import { UserType } from '../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { MediaTypesEnum } from '../media/enum/media-types.enum';
import { MediaService } from '../media/media.service';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/category-create.dto';
import { DeleteManyCategoryDto } from './dto/category-delete.dto';
import { GetParamCategoryDto } from './dto/category-get.dto';
import { UpdateCategoryDto } from './dto/category-update.dto';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.CATEGORY)
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly mediaService: MediaService,
    ) {}

    @Get(CATEGORY_ROUTE.FIND)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.CATEGORY,
            action: [PermissionActionEnum.READ],
        },
    ])
    find(@Query() query: DynamicQuery) {
        return this.categoryService.find(query);
    }

    @Post(CATEGORY_ROUTE.CREATE)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.CATEGORY,
            action: [PermissionActionEnum.CREATE],
        },
    ])
    @UserType(ROLE_TITLE.staff)
    @UseInterceptors(FileInterceptor(FORMDATA_FIELD_MEDIA.IMAGE, multerOptions))
    async add(@Request() req: AppRequest, @Body() body: CreateCategoryDto, @UploadedFile() file: Express.Multer.File) {
        const { employeeId, userId } = req.accessPayload;

        if (file) {
            const saveImage = await this.mediaService.save(
                userId,
                file,
                multerConfig.category,
                multerConfig.format.category
                    .replace(FileFormatEnum.STAFF_ID, employeeId)
                    .replace(FileFormatEnum.MEDIA_TYPE, MediaTypesEnum.IMAGE),
            );
            body.imageId = saveImage.id;
        }

        return this.categoryService.create(employeeId, body);
    }

    @Put(CATEGORY_ROUTE.UPDATE)
    @TargetActionRequire([{ target: PermissionTargetEnum.CATEGORY, action: [PermissionActionEnum.UPDATE] }])
    @UserType(ROLE_TITLE.staff)
    @UseInterceptors(FileInterceptor(FORMDATA_FIELD_MEDIA.IMAGE, multerOptions))
    async update(
        @Request() req: AppRequest,
        @Param() param: GetParamCategoryDto,
        @Body() body: UpdateCategoryDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const { id: categoryId } = param;
        const { employeeId, userId } = req.accessPayload;

        if (file) {
            const saveImage = await this.mediaService.save(
                userId,
                file,
                multerConfig.category,
                multerConfig.format.category
                    .replace(FileFormatEnum.STAFF_ID, employeeId)
                    .replace(FileFormatEnum.MEDIA_TYPE, MediaTypesEnum.IMAGE),
            );
            body.imageId = saveImage.id;
        }

        return this.categoryService.update(employeeId, categoryId, body);
    }

    @Put(CATEGORY_ROUTE.DELETE_ONE)
    @TargetActionRequire([{ target: PermissionTargetEnum.CATEGORY, action: [PermissionActionEnum.DELETE] }])
    @UserType(ROLE_TITLE.staff)
    deleteOne(@Request() req: AppRequest, @Param() param: GetParamCategoryDto) {
        const { id: categoryId } = param;
        const { employeeId } = req.accessPayload;

        return this.categoryService.delete(employeeId, categoryId);
    }

    @Put(CATEGORY_ROUTE.DELETE_ONE)
    @TargetActionRequire([{ target: PermissionTargetEnum.CATEGORY, action: [PermissionActionEnum.DELETE] }])
    @UserType(ROLE_TITLE.staff)
    deleteMany(@Request() req: AppRequest, @Body() body: DeleteManyCategoryDto) {
        const { ids: categoryIds } = body;
        const { employeeId } = req.accessPayload;

        return this.categoryService.deleteMany(employeeId, categoryIds);
    }
}
