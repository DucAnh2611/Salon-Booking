import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UpdateProductTypeBodyDto } from '../../product/dto/product-update.dto';
class UpdateTypesAttributeValueDto {
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

export class UpdateTypesExistDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => UpdateTypesAttributeValueDto)
    value: UpdateTypesAttributeValueDto;

    @IsOptional()
    @IsUUID('all')
    thumbnailId?: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;
}
export class UpdateProductTypesDto {
    @IsOptional()
    @IsUUID('all')
    productTypesId?: string;

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
    @Type(() => UpdateTypesExistDto)
    types: UpdateTypesExistDto[];
}

export class UpdateProductTypesBodyDto extends UpdateProductTypeBodyDto {
    @IsNotEmpty()
    @IsString()
    productId: string;
}
