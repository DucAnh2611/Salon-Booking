import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderServiceItemDto {
    @IsNotEmpty()
    @IsUUID('all')
    itemId: string;

    @IsNotEmpty()
    @IsUUID('all')
    employeeId: string;

    @IsNotEmpty()
    @IsUUID('all')
    serviceId: string;

    @IsNotEmpty()
    @IsUUID('all')
    shiftId: string;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    bookingTime: Date;
}
