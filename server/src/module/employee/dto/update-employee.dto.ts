import { IsDate, IsEnum, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';
import { GenderEnum } from '../../../common/enum/gender.enum';

export class UpdateEmployeeDto {
    @IsOptional()
    @IsEnum(GenderEnum)
    gender?: GenderEnum = GenderEnum.OTHER;

    @IsOptional()
    @IsString()
    lastname?: string;

    @IsOptional()
    @IsString()
    firstname?: string;

    @IsOptional()
    @IsPhoneNumber('VN')
    phone?: string;

    @IsOptional()
    @IsUUID('all')
    avatar?: string;

    @IsOptional()
    @IsDate()
    birthday?: Date;
}
