import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CLIENT_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { DataErrorCodeEnum } from '../../../common/enum/data-error-code.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { appConfig } from '../../../config/app.config';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { BadRequest } from '../../../shared/exception/error.exception';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { ClientService } from '../client.service';
import { ClientOTPDto, ClientOTPTokenDto } from '../dto/client-otp.dto';

@Controller(ROUTER.CLIENT)
export class ClientVerifyController {
    constructor(private readonly clientService: ClientService) {}

    @Get(CLIENT_ROUTE.VERIFY_EMAIL)
    @UserType(UserTypeEnum.CLIENT)
    @UseGuards(AccessTokenGuard, UserTypeGuard)
    async verifyEmail(@Req() req: AppRequest) {
        const { email } = req.accessPayload;
        if (!email) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_EMAIL });
        }
        return this.clientService.verifyEmail({ email });
    }

    @Post(CLIENT_ROUTE.VERIFY_EMAIL_OTP)
    @UserType(UserTypeEnum.CLIENT)
    @UseGuards(AccessTokenGuard, UserTypeGuard)
    async verifyOTPEmail(@Body() body: ClientOTPDto, @Req() req: AppRequest) {
        const { otp } = body;
        const { email } = req.accessPayload;

        if (!email) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_EMAIL });
        }
        if (!otp) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_OTP });
        }

        return this.clientService.verifyEmailOTP({ email, otp });
    }

    @Get(CLIENT_ROUTE.VERIFY_EMAIL_OTP)
    async getOTPToken(@Query() query: ClientOTPTokenDto, @Res() res: Response) {
        const { token } = query;
        if (!token) {
            throw new BadRequest({ message: DataErrorCodeEnum.NO_OTP_TOKEN });
        }
        const verified = await this.clientService.verifyEmailOTPByToken({ token });
        if (!verified) {
            throw new BadRequest({ message: DataErrorCodeEnum.OTP_NOT_MATCH });
        }

        return res.redirect(`${appConfig.clientUrl}`);
    }
}
