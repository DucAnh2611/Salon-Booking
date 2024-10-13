import { Body, Controller, Get, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CLIENT_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { DataErrorCodeEnum } from '../../../common/enum/data-error-code.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { AppRequest } from '../../../common/interface/custom-request.interface';
import { appConfig } from '../../../config/app.config';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { BadRequest } from '../../../shared/exception/error.exception';
import { AccessTokenClientGuard } from '../../../shared/guard/accessToken.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { CheckResetPasswordSignatureDto, GetQueryCheckEmailDto } from '../dto/client-get.dto';
import { ClientOTPDto, ClientOTPTokenDto } from '../dto/client-otp.dto';
import { ClientResetPasswordDto } from '../dto/client-update.dto';
import { ClientService } from '../service/client.service';

@Controller(ROUTER.CLIENT)
export class ClientVerifyController {
    constructor(private readonly clientService: ClientService) {}

    @Get(CLIENT_ROUTE.VERIFY_EMAIL)
    @UseGuards(AccessTokenClientGuard, UserTypeGuard)
    @UserType(UserTypeEnum.CLIENT)
    async verifyEmail(@Req() req: AppRequest) {
        const { email } = req.accessPayload;
        if (!email) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_EMAIL });
        }
        return this.clientService.verifyEmail({ email });
    }

    @Post(CLIENT_ROUTE.VERIFY_EMAIL_OTP)
    @UseGuards(AccessTokenClientGuard, UserTypeGuard)
    @UserType(UserTypeEnum.CLIENT)
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

    @Get(CLIENT_ROUTE.VERIFY_EMAIL_URL)
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

    @Get(CLIENT_ROUTE.EXIST)
    existEmail(@Query() query: GetQueryCheckEmailDto) {
        const { email } = query;
        return this.clientService.isExistByEmail(email);
    }

    @Get(CLIENT_ROUTE.SEND_RESET_PASSWORD_EMAIL)
    async sendEmailSignature(@Query() query: GetQueryCheckEmailDto) {
        const { email } = query;
        return this.clientService.sendLinkResetPassword(email);
    }

    @Get(CLIENT_ROUTE.CHECK_RESET_PASSWORD_SIGNATURE)
    checkEmailSignature(@Query() query: CheckResetPasswordSignatureDto) {
        return this.clientService.checkSignature(query);
    }

    @Put(CLIENT_ROUTE.RESET_PASSWORD)
    resetPassword(@Body() body: ClientResetPasswordDto) {
        return this.clientService.resetPassword(body);
    }
}
