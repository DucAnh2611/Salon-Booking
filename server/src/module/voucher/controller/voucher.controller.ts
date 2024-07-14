import { Controller, Get, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../../common/constant/role.constant';
import { ROUTER } from '../../../common/constant/router.constant';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { VoucherService } from '../voucher.service';

@UseGuards(AccessTokenGuard, UserTypeGuard, PermissionGuard)
@UserType(ROLE_TITLE.client)
@Controller({ path: ROUTER.VOUCHER })
export class VoucherController {
    constructor(private readonly voucherService: VoucherService) {}

    @Get()
    async test() {
        return 'client';
    }
}
