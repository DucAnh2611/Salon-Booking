import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';
import { GenderEnum } from '../../../common/enum/gender.enum';

export class CreateUserDto {
    @IsOptional()
    @IsDate()
    birthday?: Date;

    @IsOptional()
    @IsEnum(GenderEnum)
    gender?: GenderEnum = GenderEnum.OTHER;

    @IsNotEmpty()
    // @IsStrongPassword()
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
