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

    @IsNotEmpty()
    @IsEmail()
    email: string;
}
