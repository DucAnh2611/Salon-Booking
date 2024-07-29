import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { CreateServiceBaseDto } from '../../service-base/dto/service-base-create.dto';
import { ServiceEmployeeDto } from '../../service-employee/dto/service-employee-create.dto';
import { CreateSeviceStepDto } from '../../service-step/dto/service-step-create.dto';

export class CreateServiceDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateServiceBaseDto)
    base: CreateServiceBaseDto;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ServiceEmployeeDto)
    employees: ServiceEmployeeDto[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateSeviceStepDto)
    steps: CreateSeviceStepDto[];
}
