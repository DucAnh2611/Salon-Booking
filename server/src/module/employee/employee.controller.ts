import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { EMPLOYEE_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { PermissionActionEnum, PermissionTargetEnum } from '../../common/enum/permission.enum';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../../shared/decorator/permission.decorator';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { CreateEmployeeDto } from './dto/create-emplotee.dto';
import { FindEmployeeQueryDto, GetEmployeeParamDto } from './dto/get-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';

@UseGuards(AccessTokenGuard, PermissionGuard)
@Controller(ROUTER.EMPLOYEE)
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Get(EMPLOYEE_ROUTE.INFO)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.READ] }])
    info(@Param() param: GetEmployeeParamDto) {
        const { id } = param;
        return { data: id };
    }

    @Post(EMPLOYEE_ROUTE.FIND)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.READ] }])
    find(@Body() query: FindEmployeeQueryDto) {
        return this.employeeService.findEmployee(query);
    }

    @Post(EMPLOYEE_ROUTE.ADD)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.CREATE] }])
    create(@Request() req: AppRequest, @Body() body: CreateEmployeeDto) {
        const { employeeId } = req.accessPayload;
        return this.employeeService.createEmployee(employeeId, body);
    }

    @Put(EMPLOYEE_ROUTE.UPDATE)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.UPDATE] }])
    update(@Request() req: AppRequest, @Param() param: GetEmployeeParamDto, @Body() body: UpdateEmployeeDto) {
        const { id: targetEmployeeId } = param;
        const { employeeId: requestEmployeeId } = req.accessPayload;
        return this.employeeService.updateEmployee({ requestEmployeeId, targetEmployeeId, newInfo: body });
    }

    @Delete(EMPLOYEE_ROUTE.DELETE_ONE)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.DELETE] }])
    deleteOne(@Param() param: GetEmployeeParamDto) {
        const { id } = param;
        return { id };
    }

    @Delete(EMPLOYEE_ROUTE.DELETE_MANY)
    @TargetActionRequire([{ target: PermissionTargetEnum.EMPLOYEE, action: [PermissionActionEnum.DELETE] }])
    deleteMany() {
        return { data: 'ok' };
    }
}
