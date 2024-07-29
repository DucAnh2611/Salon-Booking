import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkingHourDto {
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    dateFrom: Date;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    dateEnd: Date;

    @IsNotEmpty()
    @IsString()
    start: string;

    @IsNotEmpty()
    @IsString()
    end: string;

    @IsOptional()
    @IsBoolean()
    isOff: boolean = false;
}
