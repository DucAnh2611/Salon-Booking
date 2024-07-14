import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested } from 'class-validator';

export class CreateTypesDto {
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
    thumbnailId?: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;
}

export class ProductTypesDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsInt()
    price: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsInt()
    quantity: number;

    @IsOptional()
    @IsString()
    sku?: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateTypesDto)
    types: CreateTypesDto[];
}

export class CreateProductTypesDto {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductTypesDto)
    productTypes: ProductTypesDto[];
}
