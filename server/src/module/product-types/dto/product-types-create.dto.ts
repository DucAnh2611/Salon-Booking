import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreateProductTypeBodyDto } from '../../product/dto/product-create.dto';

class CreateTypesAttributeValueDto {
    @IsOptional()
    @IsUUID('all')
    attrValueTempId?: string;

    @IsOptional()
    @IsUUID('all')
    attrValueId?: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsInt()
    level: number;
}

export class CreateTypesDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateTypesAttributeValueDto)
    value: CreateTypesAttributeValueDto;

    @IsOptional()
    @IsUUID('all')
    thumbnailId?: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;
}
export class CreateProductTypesDto {
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

export class CreateProductTypesBodyDto extends CreateProductTypeBodyDto {
    @IsNotEmpty()
    @IsString()
    productId: string;
}
