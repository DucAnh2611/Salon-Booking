import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { ServiceEmployeeDto } from './service-employee-create.dto';

export class BodyUpdateServiceEmployeeDto {
    @IsNotEmpty()
    @IsUUID('all')
    serviceId: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ServiceEmployeeDto)
    employees: ServiceEmployeeDto[];
}
