import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ProductBaseMediaIdDto, ProductBaseMediaURLDto } from './product-base-media.dto';

export class CreateProductBaseDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductBaseMediaIdDto)
    thumbnailIds?: ProductBaseMediaIdDto[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductBaseMediaURLDto)
    thumbnailUrls: ProductBaseMediaURLDto[];

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @IsInt()
    quantity?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @IsInt()
    price?: number;

    @IsOptional()
    @IsString()
    sku?: string;

    @IsNotEmpty()
    @IsString()
    brand: string;

    @IsOptional()
    // @IsNotEmpty()
    @IsUUID('all')
    categoryId: string;
}
