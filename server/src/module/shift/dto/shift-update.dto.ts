import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateShiftDto {
    @IsNotEmpty()
    @IsUUID('all')
    shiftId: string;

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
}
