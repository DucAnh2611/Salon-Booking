import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';
import { GenderEnum } from '../../../common/enum/gender.enum';

export class UpdateEmployeeDto {
    @IsNotEmpty()
    @IsEnum(GenderEnum)
    gender: GenderEnum = GenderEnum.OTHER;

    @IsNotEmpty()
    @IsString()
    lastname: string;

    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;

    @IsOptional()
    @IsUUID('all')
    avatar?: string;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    birthday: Date;

    @IsNotEmpty()
    @IsUUID('all')
    eRoleId: string;
}

export class ResetEmployeePasswordDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
