import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class GetServiceShiftEmployeeDto {
    @IsNotEmpty()
    @IsUUID('all')
    serviceId: string;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    bookingTime: Date;
}
