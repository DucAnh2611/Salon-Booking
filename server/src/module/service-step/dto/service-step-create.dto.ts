import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested } from 'class-validator';

export class CreateSeviceStepDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsInt()
    step: number;

    @IsOptional()
    @IsString()
    thumbnailId?: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;
}

export class BodyCreateServiceStepDto {
    @IsNotEmpty()
    @IsUUID('all')
    serviceId: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateSeviceStepDto)
    steps: CreateSeviceStepDto[];
}
