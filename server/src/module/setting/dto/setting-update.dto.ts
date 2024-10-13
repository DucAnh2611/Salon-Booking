import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SettingUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    otpEmailTime: number;

    @IsNotEmpty()
    @IsString()
    otpEmailUnit: string;

    @IsNotEmpty()
    @IsNumber()
    orderServiceConfirmTime: number;

    @IsNotEmpty()
    @IsString()
    orderServiceConfirmUnit: string;

    @IsNotEmpty()
    @IsNumber()
    resetPasswordTime: number;

    @IsNotEmpty()
    @IsString()
    resetPasswordUnit: string;
}
