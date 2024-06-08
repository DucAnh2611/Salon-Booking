import { IsEnum, IsOptional, IsString } from 'class-validator';
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
}
