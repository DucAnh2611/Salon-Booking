import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ShiftEmployeeStatusEnum } from '../../../common/enum/shift.enum';

export class UpdateShiftEmployeeDto {
    @IsNotEmpty()
    @IsUUID('all')
    shiftId: string;

    @IsNotEmpty()
    @IsEnum(ShiftEmployeeStatusEnum)
    status: ShiftEmployeeStatusEnum;
}
