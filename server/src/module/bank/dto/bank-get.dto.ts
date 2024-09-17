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
