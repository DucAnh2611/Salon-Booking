import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { ProductDetailDto } from './product-detail-create.dto';

export class ProductDetailExistDto extends ProductDetailDto {
    @IsOptional()
    @IsUUID('all')
    id: string;
}

export class UpdateProductDetailDto {
    @IsOptional()
    @IsUUID('all')
    productId: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductDetailExistDto)
    details: ProductDetailExistDto[];
}
