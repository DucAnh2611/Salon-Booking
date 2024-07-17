import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWorkingHourDto {
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    date: Date;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    start: Date;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    end: Date;

    @IsOptional()
    @IsBoolean()
    isOff: boolean = false;
}
