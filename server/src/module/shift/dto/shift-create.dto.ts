import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateShiftDto {
    @IsNotEmpty()
    @IsString()
    start: string;

    @IsNotEmpty()
    @IsString()
    end: string;

    @IsNotEmpty()
    @IsString()
    bookingStart: string;

    @IsNotEmpty()
    @IsString()
    bookingEnd: string;

    @IsNotEmpty()
    @IsUUID('all')
    workingHourId: string;
}
