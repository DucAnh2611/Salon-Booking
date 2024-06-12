import { IsNotEmpty, IsString, Length } from 'class-validator';
import { OTP_EMAIL_LENGTH } from '../../../common/constant/otp.constant';

export class ClientOTPTokenDto {
    @IsString()
    @IsNotEmpty()
    token: string;
}

export class ClientOTPDto {
    @IsString()
    @IsNotEmpty()
    @Length(OTP_EMAIL_LENGTH)
    otp: string;
}

export type TokenOTP = {
    email: string;
};
