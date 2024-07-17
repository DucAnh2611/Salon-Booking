import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetShiftParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}
