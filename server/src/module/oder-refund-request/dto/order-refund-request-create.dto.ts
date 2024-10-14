import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateOrderRefundRequestDto {
    @IsNotEmpty()
    @IsUUID('all')
    orderId: string;

    @IsOptional()
    @IsUUID('all')
    transactionId?: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsInt()
    amount: number;

    @IsNotEmpty()
    @IsString()
    accountNumber: string;

    @IsNotEmpty()
    @IsString()
    accountBankBin: string;

    @IsNotEmpty()
    @IsString()
    accountBankCode: string;

    @IsOptional()
    @IsString()
    note?: string;
}

export class CancelOrderRefundRequestDto {
    @IsNotEmpty()
    @IsUUID('all')
    orderId: string;

    @IsOptional()
    @IsUUID('all')
    requestId: string;

    @IsNotEmpty()
    @IsString()
    note: string;
}

export class CancelTransactionDto {
    @IsOptional()
    @IsUUID('all')
    transactionId: string;

    @IsNotEmpty()
    @IsString()
    note: string;
}
