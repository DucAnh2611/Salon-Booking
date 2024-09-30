import { Body, Controller, Get, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FORMDATA_FIELD_MEDIA } from '../../../common/constant/file.constants';
import { CLIENT_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { LockStateEnum } from '../../../common/enum/lock-state.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { multerOptions } from '../../../config/multer.configs';
import { NotLockState } from '../../../shared/decorator/not-lock-state.decorator';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenClientGuard } from '../../../shared/guard/accessToken.guard';
import { NotLockStateGuard } from '../../../shared/guard/not-lock-state.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { ClientUpdateInfoDto } from '../dto/client-update.dto';
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

    @Get(CLIENT_ROUTE.INFO)
    @UserType(UserTypeEnum.CLIENT)
    @NotLockState([LockStateEnum.ACCOUNT])
    info(@Request() req: AppRequest) {
        const { clientId } = req.accessPayload;

        return this.clientService.info(clientId);
    }

    @Put(CLIENT_ROUTE.UPDATE)
    @UserType(UserTypeEnum.CLIENT)
    @NotLockState([LockStateEnum.ACCOUNT])
    @UseInterceptors(FileInterceptor(FORMDATA_FIELD_MEDIA.IMAGE, multerOptions))
    update(@Request() req: AppRequest, @Body() body: ClientUpdateInfoDto, @UploadedFile() file: Express.Multer.File) {
        const { clientId, userId } = req.accessPayload;

        return this.clientService.update(userId, clientId, body, file);
    }
}
