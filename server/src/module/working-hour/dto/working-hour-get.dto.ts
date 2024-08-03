import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class GetWorkingHourParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}

export class GetWorkingHourRangeDto {
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    fromDate: Date = new Date();

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    endDate: Date = new Date();
}

export class OffWorkingQueryDto {
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    date: Date = new Date();
}
