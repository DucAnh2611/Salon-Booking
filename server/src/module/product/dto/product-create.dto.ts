import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreateProductBaseDto } from '../../product-base/dto/product-base-create.dto';
import { ProductDetailDto } from '../../product-detail/dto/product-detail-create.dto';
import { CreateProductTypesDto } from '../../product-types/dto/product-types-create.dto';

class SelectAttributeCreateDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;
}

export class SelectAttributeValueCreateDto {
    @IsNotEmpty()
    @IsUUID('all')
    tempId: string;

    @IsNotEmpty()
    @IsString()
    value: string;
}

export class LevelSelectAttributeValueCreateDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => SelectAttributeCreateDto)
    attribute: SelectAttributeCreateDto;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SelectAttributeValueCreateDto)
    value: SelectAttributeValueCreateDto[];
}

class SelectedAttributeCreateDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => LevelSelectAttributeValueCreateDto)
    first?: LevelSelectAttributeValueCreateDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => LevelSelectAttributeValueCreateDto)
    sec?: LevelSelectAttributeValueCreateDto;
}

export class CreateProductTypeBodyDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => SelectedAttributeCreateDto)
    selectAttribute: SelectedAttributeCreateDto;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateProductTypesDto)
    types: CreateProductTypesDto[];
}

export class CreateProductDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateProductBaseDto)
    base: CreateProductBaseDto;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductDetailDto)
    details: ProductDetailDto[];

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateProductTypeBodyDto)
    types: CreateProductTypeBodyDto;
}
