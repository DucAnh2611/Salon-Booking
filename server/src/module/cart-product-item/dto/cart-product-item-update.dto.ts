import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class UpdateCartProductItemDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsInt()
    quantity: number;
}
