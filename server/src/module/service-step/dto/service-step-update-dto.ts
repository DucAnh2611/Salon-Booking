import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested } from 'class-validator';

export class UpdateSeviceStepDto {
    @IsOptional()
    @IsUUID('all')
    id?: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsInt()
    step: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsUUID('all')
    thumbnailId?: string;

    @IsOptional()
    @IsUUID('all')
    thumbnailUrl?: string;
}

export class BodyUpdateServiceStepDto {
    @IsNotEmpty()
    @IsUUID('all')
    serviceId: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpdateSeviceStepDto)
    steps: UpdateSeviceStepDto[];
}
