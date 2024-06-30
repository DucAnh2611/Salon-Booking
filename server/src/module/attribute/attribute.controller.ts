import { Body, Controller, Delete, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../common/constant/role.constant';
import { ATTRIBUTE_ROUTE, ROUTER } from '../../common/constant/router.constant';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { PermissionActionEnum, PermissionTargetEnum } from '../../common/enum/permission.enum';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { DynamicQuery } from '../../common/type/query.type';
import { TargetActionRequire } from '../../shared/decorator/permission.decorator';
import { UserType } from '../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto } from './dto/attribute-create.dto';
import { DeleteManyAttributeDto } from './dto/attribute-delete.dto';
import { GetAttributeParamDto } from './dto/attribute-get.dto';
import { UpdateAttributeDto } from './dto/attribute-update.dto';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@UserType(ROLE_TITLE.staff)
@Controller(ROUTER.ATTRIBUTE)
export class AttributeController {
    constructor(private readonly attributeService: AttributeService) {}

    @Post(ATTRIBUTE_ROUTE.FIND)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.ATTRIBUTE,
            action: [PermissionActionEnum.READ],
        },
    ])
    async find(@Body() query: DynamicQuery) {
        return this.attributeService.find(query);
    }

    @Post(ATTRIBUTE_ROUTE.CREATE)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.ATTRIBUTE,
            action: [PermissionActionEnum.CREATE],
        },
    ])
    async add(@Body() body: CreateAttributeDto, @Request() req: AppRequest) {
        const { employeeId } = req.accessPayload;
        return this.attributeService.create(employeeId, body);
    }

    @Put(ATTRIBUTE_ROUTE.UPDATE)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.ATTRIBUTE,
            action: [PermissionActionEnum.UPDATE],
        },
    ])
    async update(@Param() param: GetAttributeParamDto, @Body() body: UpdateAttributeDto, @Request() req: AppRequest) {
        const { employeeId } = req.accessPayload;
        const { id: attrId } = param;
        const updatedAttr = await this.attributeService.update(employeeId, attrId, body);

        return updatedAttr;
    }

    @Delete(ATTRIBUTE_ROUTE.DELETE_ONE)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.ATTRIBUTE,
            action: [PermissionActionEnum.DELETE],
        },
    ])
    async deleteOne(@Param() param: GetAttributeParamDto, @Request() req: AppRequest) {
        const { employeeId } = req.accessPayload;
        const { id: attrId } = param;

        const deletedAttr = await this.attributeService.delete(employeeId, attrId);

        return DataSuccessCodeEnum.OK;
    }

    @Delete(ATTRIBUTE_ROUTE.DELETE_MANY)
    @TargetActionRequire([
        {
            target: PermissionTargetEnum.ATTRIBUTE,
            action: [PermissionActionEnum.DELETE],
        },
    ])
    async deleteMany(@Body() body: DeleteManyAttributeDto, @Request() req: AppRequest) {
        const { employeeId } = req.accessPayload;
        const { ids: attrIds } = body;

        const deletedAttrs = await Promise.all(
            attrIds.map((attrId: string) => this.attributeService.delete(employeeId, attrId)),
        );

        return DataSuccessCodeEnum.OK;
    }
}
