import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';

export class ProductDetailDto {
    @IsNotEmpty()
    @IsString()
    key: string;

    @IsNotEmpty()
    @IsString()
    value: string;
}

export class CreateProductDetailDto {
    @IsNotEmpty()
    @IsUUID('all')
    productId: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductDetailDto)
    details: ProductDetailDto[];
}
