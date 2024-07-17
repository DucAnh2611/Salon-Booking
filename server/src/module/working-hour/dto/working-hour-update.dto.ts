import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateWorkingHourDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    start: Date;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    end: Date;
}
