import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateProductBaseDto } from '../../product-base/dto/product-base-create.dto';
import { ProductDetailDto } from '../../product-detail/dto/product-detail-create.dto';
import { ProductTypesDto } from '../../product-types/dto/product-types-create.dto';

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
    @ValidateNested({ each: true })
    @Type(() => ProductTypesDto)
    types: ProductTypesDto[];
}
