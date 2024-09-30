import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class StatisticDashboardDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsInt()
    month?: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsInt()
    year: number;
}
