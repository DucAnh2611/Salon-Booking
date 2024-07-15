import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { UpdateServiceBaseDto } from '../../service-base/dto/service-base-update.dto';
import { ServiceEmployeeDto } from '../../service-employee/dto/service-employee-create.dto';
import { UpdateSeviceStepDto } from '../../service-step/dto/service-step-update-dto';

export class UpdateServiceDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => UpdateServiceBaseDto)
    base: UpdateServiceBaseDto;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ServiceEmployeeDto)
    employees: ServiceEmployeeDto[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateSeviceStepDto)
    steps: UpdateSeviceStepDto[];
}
