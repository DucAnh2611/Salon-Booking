import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';
import { GenderEnum } from '../../../common/enum/gender.enum';

export class CreateUserDto {
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    birthday?: Date;

    @IsOptional()
    @IsEnum(GenderEnum)
    gender?: GenderEnum = GenderEnum.OTHER;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsNotEmpty()
    @IsString()
    lastname: string;

    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;

    @IsOptional()
    @IsUUID('all')
    avatar?: string;

    roleId?: string;
}
