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
import { multerConfig, multerOptions } from '../../config/multer.configs';
import { FORMDATA_FIELD_MEDIA } from '../../constant/file.constants';
import { EMPLOYEE_ROUTE, ROUTER } from '../../constant/router.constant';
import { TargetActionRequire } from '../../decorator/permission.decorator';
import { UserType } from '../../decorator/user-types.decorator';
import { DataErrorCodeEnum } from '../../enum/data-error-code.enum';
import { PermissionActionEnum, PermissionTargetEnum } from '../../enum/permission.enum';
import { UserTypeEnum } from '../../enum/user.enum';
import { BadRequest } from '../../exception/error.exception';
import { AccessTokenGuard } from '../../guard/accessToken.guard';
import { PermissionGuard } from '../../guard/permission.guard';
import { UserTypeGuard } from '../../guard/user-type.guard';
import { AppRequest } from '../../interface/custom-request.interface';
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
