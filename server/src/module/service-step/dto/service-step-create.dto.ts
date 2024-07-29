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
    @IsUUID('all')
    thumbnailId?: string;

    @IsOptional()
    @IsUUID('all')
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
