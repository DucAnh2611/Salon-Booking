import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { ServiceEmployeeExperienceEnum } from '../../../common/enum/service.enum';

export class ServiceEmployeeDto {
    @IsNotEmpty()
    @IsUUID('all')
    employeeId: string;

    @IsNotEmpty()
    @IsEnum(ServiceEmployeeExperienceEnum)
    experience: ServiceEmployeeExperienceEnum;
}

export class BodyCreateServiceEmployeeDto {
    @IsNotEmpty()
    @IsUUID('all')
    serviceId: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ServiceEmployeeDto)
    employees: ServiceEmployeeDto[];
}
