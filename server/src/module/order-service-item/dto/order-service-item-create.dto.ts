import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderServiceItemDto {
    @IsNotEmpty()
    @IsUUID('all')
    employeeId: string;

    @IsNotEmpty()
    @IsUUID('all')
    serviceId: string;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    date: Date;
}
