import {
    Body,
    Controller,
    Delete,
    Param,
    Post,
    Put,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FORMDATA_FIELD_MEDIA } from '../../../common/constant/file.constants';
import { ROLE_TITLE } from '../../../common/constant/role.constant';
import { ROUTER, VOUCHER_ROUTE } from '../../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { appConfig } from '../../../config/app.config';
import { multerConfig, multerOptions } from '../../../config/multer.configs';
import { TargetActionRequire } from '../../../shared/decorator/permission.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { MediaService } from '../../media/media.service';
import { CreateVoucherDto } from '../dto/voucher-create.dto';
import { DeleteManyVoucherDto } from '../dto/voucher-delete.dto';
import { VoucherGetParamDto } from '../dto/voucher-get.dto';
import { UpdateVoucherDto } from '../dto/voucher-update.dto';
import { VoucherService } from '../voucher.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@UserType(ROLE_TITLE.staff)
@Controller({ path: ROUTER.VOUCHER, host: appConfig.employeeUrl })
export class VoucherAdminController {
    constructor(
        private readonly voucherService: VoucherService,
        private readonly mediaService: MediaService,
    ) {}

    @Post(VOUCHER_ROUTE.CREATE)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.VOUCHER,
            action: [PermissionActionEnum.CREATE],
        },
    ])
    @UseInterceptors(FileInterceptor(FORMDATA_FIELD_MEDIA.IMAGE, multerOptions))
    async create(
        @Request() req: AppRequest,
        @Body() body: CreateVoucherDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const { employeeId, userId } = req.accessPayload;

        if (file) {
            const saveImage = await this.mediaService.save(userId, file, multerConfig.voucher);
            body.imageId = saveImage.id;
        }

        return this.voucherService.create(employeeId, body);
    }

    @Put(VOUCHER_ROUTE.UPDATE)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.VOUCHER,
            action: [PermissionActionEnum.UPDATE],
        },
    ])
    @UseInterceptors(FileInterceptor(FORMDATA_FIELD_MEDIA.IMAGE, multerOptions))
    async update(
        @Request() req: AppRequest,
        @Param() param: VoucherGetParamDto,
        @Body() body: UpdateVoucherDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const { employeeId, userId } = req.accessPayload;
        const { id: voucherId } = param;

        if (file) {
            const saveImage = await this.mediaService.save(userId, file, multerConfig.voucher);
            body.imageId = saveImage.id;
        }

        return this.voucherService.update(employeeId, voucherId, body);
    }

    @Delete(VOUCHER_ROUTE.DELETE_ONE)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.VOUCHER,
            action: [PermissionActionEnum.DELETE],
        },
    ])
    async deleteOne(@Request() req: AppRequest, @Param() param: VoucherGetParamDto) {
        const { employeeId } = req.accessPayload;
        const { id: voucherId } = param;

        return this.voucherService.delete(employeeId, voucherId);
    }

    @Delete(VOUCHER_ROUTE.DELETE_MANY)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.VOUCHER,
            action: [PermissionActionEnum.DELETE],
        },
    ])
    async deleteMany(@Request() req: AppRequest, @Body() body: DeleteManyVoucherDto) {
        const { employeeId } = req.accessPayload;
        const { ids: voucherIds } = body;

        return this.voucherService.deleteMany(employeeId, voucherIds);
    }
}
