import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateProductTypesAttributeDto {
    @IsNotEmpty()
    @IsUUID('all')
    productTypesId: string;

    @IsNotEmpty()
    @IsUUID('all')
    attrId: string;

    @IsNotEmpty()
    @IsString()
    value: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsInt()
    level: number;

    @IsOptional()
    @IsUUID('all')
    mediaId?: string;

    @IsOptional()
    @IsString()
    mediaUrl?: string;
}
