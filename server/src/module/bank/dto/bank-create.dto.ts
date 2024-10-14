import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class BankCreateQuickLinkQRDto {
    @IsNotEmpty()
    @IsString()
    bankCode: string;

    @IsNotEmpty()
    @IsString()
    bankAccount: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    amount: number;

    @IsNotEmpty()
    @IsString()
    desc: string;
}
