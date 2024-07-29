import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateWorkingHourDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;

    @IsNotEmpty()
    @IsString()
    start: string;

    @IsNotEmpty()
    @IsString()
    end: string;
}
