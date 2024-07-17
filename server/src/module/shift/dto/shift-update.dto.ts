import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateShiftDto {
    @IsNotEmpty()
    @IsUUID('all')
    shiftId: string;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    start: Date;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    end: Date;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    bookingStart: Date;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    bookingEnd: Date;
}
