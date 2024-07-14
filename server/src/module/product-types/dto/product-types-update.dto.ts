import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ProductTypesDto } from './product-types-create.dto';

export class ProductTypesExistDto extends ProductTypesDto {
    @IsOptional()
    @IsUUID('all')
    productTypesId: string;
}

export class UpdateProductTypesDto {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductTypesExistDto)
    productTypes: ProductTypesExistDto[];
}
