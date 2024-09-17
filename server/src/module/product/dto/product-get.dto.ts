import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class GetProductInStockQueryDto {
    @IsNotEmpty()
    @IsUUID('all')
    productId: string;

    @IsOptional()
    @IsUUID('all')
    typeId?: string;
}
