import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreateCartProductItemDto {
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
