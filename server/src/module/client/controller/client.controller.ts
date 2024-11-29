import { Body, Controller, Get, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../../config/multer.configs';
import { FORMDATA_FIELD_MEDIA } from '../../../constant/file.constants';
import { CLIENT_ROUTE, ROUTER } from '../../../constant/router.constant';
import { NotLockState } from '../../../decorator/not-lock-state.decorator';
import { UserType } from '../../../decorator/user-types.decorator';
import { LockStateEnum } from '../../../enum/lock-state.enum';
import { UserTypeEnum } from '../../../enum/user.enum';
import { AccessTokenClientGuard } from '../../../guard/accessToken.guard';
import { NotLockStateGuard } from '../../../guard/not-lock-state.guard';
import { UserTypeGuard } from '../../../guard/user-type.guard';
import { AppRequest } from '../../../interface/custom-request.interface';
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
