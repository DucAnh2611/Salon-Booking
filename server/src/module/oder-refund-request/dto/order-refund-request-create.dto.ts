import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateOrderRefundRequestDto {
    @IsNotEmpty()
    @IsUUID('all')
    orderId: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsInt()
    amount: number;

    @IsNotEmpty()
    @IsString()
    accountName: string;

    @IsNotEmpty()
    @IsString()
    accountNumber: string;

    @IsNotEmpty()
    @IsString()
    accountBankBin: string;

    @IsOptional()
    @IsString()
    note?: string;
}
