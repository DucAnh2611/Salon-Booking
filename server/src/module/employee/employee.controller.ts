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
import { FORMDATA_FIELD_MEDIA } from '../../common/constant/file.constants';
import { EMPLOYEE_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { PermissionActionEnum, PermissionTargetEnum } from '../../common/enum/permission.enum';
import { UserTypeEnum } from '../../common/enum/user.enum';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { multerConfig, multerOptions } from '../../config/multer.configs';
import { TargetActionRequire } from '../../shared/decorator/permission.decorator';
import { UserType } from '../../shared/decorator/user-types.decorator';
import { BadRequest } from '../../shared/exception/error.exception';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { MediaService } from '../media/service/media.service';
import { CreateEmployeeDto } from './dto/create-emplotee.dto';
import { DeleteEmployeeDto } from './dto/delete-employee.dto';
import { FindEmployeeQueryDto, GetEmployeeParamDto } from './dto/get-employee.dto';
import { ResetEmployeePasswordDto, UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.EMPLOYEE)
export class EmployeeController {
    constructor(
        private readonly employeeService: EmployeeService,
        private readonly mediaService: MediaService,
    ) {}

    @Get(EMPLOYEE_ROUTE.ME)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([])
    me(@Req() req: AppRequest) {
        const { employeeId } = req.accessPayload;
        return this.employeeService.getMyInfo(employeeId);
    }

    @Get(EMPLOYEE_ROUTE.FIND)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.READ] }])
    find(@Req() req: AppRequest, @Query() query: FindEmployeeQueryDto) {
        return this.employeeService.findEmployee(query);
    }

    @Get(EMPLOYEE_ROUTE.INFO)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.READ] }])
    info(@Param() param: GetEmployeeParamDto) {
        const { id } = param;
        return this.employeeService.detail(id);
    }

    @Post(EMPLOYEE_ROUTE.ADD)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.CREATE] }])
    @UseInterceptors(FileInterceptor(FORMDATA_FIELD_MEDIA.IMAGE, multerOptions))
    async create(@Req() req: AppRequest, @Body() body: CreateEmployeeDto, @UploadedFile() file?: Express.Multer.File) {
        const { employeeId, userId } = req.accessPayload;

        const isExist = await this.employeeService.isExist({ username: body.username });

        if (isExist) {
            throw new BadRequest({ message: DataErrorCodeEnum.EXISTED_USERNAME });
        }

        if (file) {
            const saveImage = await this.mediaService.save(userId, file, `${multerConfig.staff}/${userId}`);
            body.avatar = saveImage.id;
        }

        return this.employeeService.createEmployee(employeeId, body);
    }
    @Put(EMPLOYEE_ROUTE.RESET_PW)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.UPDATE] }])
    async resetPw(@Req() req: AppRequest, @Body() body: ResetEmployeePasswordDto) {
        const { employeeId: requestEmployeeId } = req.accessPayload;

        return this.employeeService.resetEmpPassword(requestEmployeeId, body);
    }

    @Put(EMPLOYEE_ROUTE.UPDATE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.UPDATE] }])
    @UseInterceptors(FileInterceptor(FORMDATA_FIELD_MEDIA.IMAGE, multerOptions))
    async update(
        @Req() req: AppRequest,
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
                `${multerConfig.staff}/${isExist.userId}`,
            );
            body.avatar = saveImage.id;
        }

        return this.employeeService.updateEmployee({ requestEmployeeId, targetEmployeeId, newInfo: body });
    }

    @Delete(EMPLOYEE_ROUTE.DELETE_ONE)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.DELETE] }])
    deleteOne(@Req() req: AppRequest, @Param() param: GetEmployeeParamDto) {
        const { id: deleteId } = param;
        const { employeeId } = req.accessPayload;

        return this.employeeService.delete(employeeId, [deleteId]);
    }

    @Delete(EMPLOYEE_ROUTE.DELETE_MANY)
    @UserType(UserTypeEnum.STAFF)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.DELETE] }])
    deleteMany(@Req() req: AppRequest, @Body() body: DeleteEmployeeDto) {
        const { ids } = body;
        const { employeeId } = req.accessPayload;

        return this.employeeService.delete(employeeId, ids);
    }
}
