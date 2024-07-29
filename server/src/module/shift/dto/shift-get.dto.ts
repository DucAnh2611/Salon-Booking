import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class GetShiftParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}

export class GetShiftFromBookingTimeDto {
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    bookingDate: Date;
}
