import { Transform, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

export class OrderServiceCheckOverlap {
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

export class OrderServiceCheckOverlapDto {
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => OrderServiceCheckOverlap)
    services: OrderServiceCheckOverlap[];

    @IsNotEmpty()
    @IsUUID('all')
    employeeId: string;
}
