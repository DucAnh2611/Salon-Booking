import { Controller, UseGuards } from '@nestjs/common';
import { ROUTER } from '../../../common/constant/router.constant';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@Controller(ROUTER.ORDER)
export class OrderAdminController {}
