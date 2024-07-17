import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreateOrderProductItemDto {
    @IsNotEmpty()
    @IsUUID('all')
    productId: string;

    @IsOptional()
    @IsUUID('all')
    productTypeId?: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsInt()
    quantity: number;
}
