import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetWorkingHourParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}
