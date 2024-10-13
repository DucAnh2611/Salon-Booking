import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsStrongPassword,
    IsUUID,
} from 'class-validator';
import { GenderEnum } from '../../../common/enum/gender.enum';

export class ClientUpdateLockDto {
    @IsNotEmpty()
    @IsUUID('all')
    clientId: string;

    @IsOptional()
    @IsBoolean()
    lockAccount?: boolean;

    @IsOptional()
    @IsBoolean()
    lockOrder?: boolean;
}

export class ClientUpdateInfoDto {
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    birthday: Date;

    @IsOptional()
    @IsEnum(GenderEnum)
    gender: GenderEnum = GenderEnum.OTHER;

    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsNotEmpty()
    @IsString()
    lastname: string;

    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;
}

export class ClientResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    token: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    newPassword: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    confirmPassword: string;
}
