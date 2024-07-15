import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { CreateProductBaseDto } from '../../product-base/dto/product-base-create.dto';
import { UpdateProductBaseDto } from '../../product-base/dto/product-base-update.dto';
import { ProductDetailExistDto } from '../../product-detail/dto/product-detail-update.dto';
import { ProductTypesExistDto } from '../../product-types/dto/product-types-update.dto';

export class UpdateProductDto {
    @IsNotEmpty()
    @IsUUID('all')
    productId: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateProductBaseDto)
    base: UpdateProductBaseDto;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductDetailExistDto)
    details: ProductDetailExistDto[];

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductTypesExistDto)
    types: ProductTypesExistDto[];
}
