import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FORMDATA_FIELD_MEDIA } from '../../common/constant/file.constants';
import { ROLE_TITLE } from '../../common/constant/role.constant';
import { EMPLOYEE_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { FileFormatEnum } from '../../common/enum/files.enum';
import { PermissionActionEnum, PermissionTargetEnum } from '../../common/enum/permission.enum';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { multerConfig, multerOptions } from '../../config/multer.configs';
import { TargetActionRequire } from '../../shared/decorator/permission.decorator';
import { UserType } from '../../shared/decorator/user-types.decorator';
import { BadRequest } from '../../shared/exception/error.exception';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { MediaTypesEnum } from '../media/enum/media-types.enum';
import { MediaService } from '../media/media.service';
import { CreateEmployeeDto } from './dto/create-emplotee.dto';
import { FindEmployeeQueryDto, GetEmployeeParamDto } from './dto/get-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.EMPLOYEE)
export class EmployeeController {
    constructor(
        private readonly employeeService: EmployeeService,
        private readonly mediaService: MediaService,
    ) {}

    @Get(EMPLOYEE_ROUTE.INFO)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.READ] }])
    @UserType(ROLE_TITLE.staff)
    info(@Param() param: GetEmployeeParamDto) {
        const { id } = param;
        return { data: id };
    }

    @Post(EMPLOYEE_ROUTE.FIND)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.READ] }])
    @UserType(ROLE_TITLE.staff)
    find(@Body() query: FindEmployeeQueryDto) {
        return this.employeeService.findEmployee(query);
    }

    @Post(EMPLOYEE_ROUTE.ADD)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.CREATE] }])
    @UseInterceptors(FileInterceptor(FORMDATA_FIELD_MEDIA.IMAGE, multerOptions))
    @UserType(ROLE_TITLE.staff)
    async create(
        @Request() req: AppRequest,
        @Body() body: CreateEmployeeDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const { employeeId, userId } = req.accessPayload;

        const isExist = await this.employeeService.isExist({ username: body.username });

        if (isExist) {
            throw new BadRequest({ message: DataErrorCodeEnum.EXISTED_USERNAME });
        }

        if (file) {
            const saveImage = await this.mediaService.save(
                userId,
                file,
                multerConfig.voucher,
                multerConfig.format.user.avatar
                    .replace(FileFormatEnum.USER_ID, userId)
                    .replace(FileFormatEnum.MEDIA_TYPE, MediaTypesEnum.IMAGE),
            );
            body.avatar = saveImage.id;
        }

        return this.employeeService.createEmployee(employeeId, body);
    }

    @Put(EMPLOYEE_ROUTE.UPDATE)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.UPDATE] }])
    @UseInterceptors(FileInterceptor(FORMDATA_FIELD_MEDIA.IMAGE, multerOptions))
    @UserType(ROLE_TITLE.staff)
    async update(
        @Request() req: AppRequest,
        @Param() param: GetEmployeeParamDto,
        @Body() body: UpdateEmployeeDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const { id: targetEmployeeId } = param;
        const { employeeId: requestEmployeeId } = req.accessPayload;

        const isExist = await this.employeeService.getById(targetEmployeeId);

        if (!isExist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_EMPLOYEE });
        }

        if (file) {
            const saveImage = await this.mediaService.save(
                isExist.userId,
                file,
                multerConfig.voucher,
                multerConfig.format.user.avatar
                    .replace(FileFormatEnum.USER_ID, isExist.userId)
                    .replace(FileFormatEnum.MEDIA_TYPE, MediaTypesEnum.IMAGE),
            );
            body.avatar = saveImage.id;
        }

        return this.employeeService.updateEmployee({ requestEmployeeId, targetEmployeeId, newInfo: body });
    }

    @Delete(EMPLOYEE_ROUTE.DELETE_ONE)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.DELETE] }])
    @UserType(ROLE_TITLE.staff)
    deleteOne(@Param() param: GetEmployeeParamDto) {
        const { id } = param;
        return { id };
    }

    @Delete(EMPLOYEE_ROUTE.DELETE_MANY)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.DELETE] }])
    @UserType(ROLE_TITLE.staff)
    deleteMany() {
        return DataSuccessCodeEnum.OK;
    }
}
