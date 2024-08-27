import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../../common/constant/role.constant';
import { CLIENT_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenClientGuard } from '../../../shared/guard/accessToken.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { ClientService } from '../client.service';

@UseGuards(AccessTokenClientGuard, UserTypeGuard)
@Controller(ROUTER.CLIENT)
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get(CLIENT_ROUTE.ME)
    @UserType(ROLE_TITLE.client)
    me(@Request() req: AppRequest) {
        const { clientId } = req.accessPayload;

        return this.clientService.me(clientId);
    }
}
