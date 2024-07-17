import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { ShiftEmployeeStatusEnum } from '../../../common/enum/shift.enum';

export class ShiftEmployeeDto {
    @IsNotEmpty()
    @IsUUID('all')
    employeeId: string;

    @IsNotEmpty()
    @IsEnum(ShiftEmployeeStatusEnum)
    status: ShiftEmployeeStatusEnum = ShiftEmployeeStatusEnum.AVAILABLE;
}

export class BodyCreateShiftEmployeeDto {
    @IsNotEmpty()
    @IsUUID('all')
    shiftId: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ShiftEmployeeDto)
    assignments: ShiftEmployeeDto[];
}
