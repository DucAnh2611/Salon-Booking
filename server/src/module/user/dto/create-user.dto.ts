import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GenderEnum } from '../../../common/enum/gender.enum';

export class CreateUserDto {
    @IsOptional()
    @IsDate()
    birthday?: Date;

    @IsOptional()
    @IsEnum(GenderEnum)
    gender: GenderEnum = GenderEnum.OTHER;

    @IsNotEmpty()
    // @IsEmail()
    email: string;

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

    roleId?: string;
}
