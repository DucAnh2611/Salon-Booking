import { IsOptional, IsString } from 'class-validator';

export class BankSearchDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    code?: string;

    @IsOptional()
    @IsString()
    shortName?: string;
}

export class TransactionRefund {
    reference_number?: string;
    amount_out?: number;
    amount_in?: number;
    limit?: number;
    transaction_date_min?: string;
    transaction_date_max?: string;
}
