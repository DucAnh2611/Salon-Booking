import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { CLIENT_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { LockStateEnum } from '../../../common/enum/lock-state.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { NotLockState } from '../../../shared/decorator/not-lock-state.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenClientGuard } from '../../../shared/guard/accessToken.guard';
import { NotLockStateGuard } from '../../../shared/guard/not-lock-state.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { ClientService } from '../service/client.service';

@UseGuards(AccessTokenClientGuard, UserTypeGuard, NotLockStateGuard)
@Controller(ROUTER.CLIENT)
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get(CLIENT_ROUTE.ME)
    @UserType(UserTypeEnum.CLIENT)
    @NotLockState([LockStateEnum.ACCOUNT])
    me(@Request() req: AppRequest) {
        const { clientId } = req.accessPayload;

        return this.clientService.me(clientId);
    }
}
