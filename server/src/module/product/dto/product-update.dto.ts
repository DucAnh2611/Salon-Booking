import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UpdateProductBaseDto } from '../../product-base/dto/product-base-update.dto';
import { ProductDetailExistDto } from '../../product-detail/dto/product-detail-update.dto';
import { UpdateProductTypesDto } from '../../product-types/dto/product-types-update.dto';

class SelectAttributeUpdateDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;
}

export class SelectAttributeValueUpdateDto {
    @IsOptional()
    @IsUUID('all')
    tempId?: string;

    @IsOptional()
    @IsUUID('all')
    id?: string;

    @IsNotEmpty()
    @IsString()
    value: string;
}

export class LevelSelectAttributeValueUpdateDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => SelectAttributeUpdateDto)
    attribute: SelectAttributeUpdateDto;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SelectAttributeValueUpdateDto)
    value: SelectAttributeValueUpdateDto[];
}

export class SelectedAttributeUpdateDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => LevelSelectAttributeValueUpdateDto)
    first?: LevelSelectAttributeValueUpdateDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => LevelSelectAttributeValueUpdateDto)
    sec?: LevelSelectAttributeValueUpdateDto;
}

export class UpdateProductTypeBodyDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => SelectedAttributeUpdateDto)
    selectAttribute: SelectedAttributeUpdateDto;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpdateProductTypesDto)
    types: UpdateProductTypesDto[];
}

export class UpdateProductDto {
    @IsNotEmpty()
    @IsUUID('all')
    productId: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => UpdateProductBaseDto)
    base: UpdateProductBaseDto;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductDetailExistDto)
    details: ProductDetailExistDto[];

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => UpdateProductTypeBodyDto)
    types: UpdateProductTypeBodyDto;
}
