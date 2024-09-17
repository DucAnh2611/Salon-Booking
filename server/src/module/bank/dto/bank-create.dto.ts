import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class BankCreateQuickLinkQRDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    bankBin: number;

    @IsNotEmpty()
    @IsString()
    bankAccount: string;

    @IsNotEmpty()
    @IsString()
    bankName: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    amount: number;

    @IsNotEmpty()
    @IsString()
    desc: string;
}
