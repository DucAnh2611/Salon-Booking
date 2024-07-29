import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteShiftEmployeeDto {
    @IsNotEmpty()
    @IsUUID('all')
    shiftId: string;

    @IsNotEmpty()
    @IsUUID('all', { each: true })
    employeeIds: string[];
}

export class DeleteOneShiftEmployeeDto {
    @IsNotEmpty()
    @IsUUID('all')
    shiftId: string;

    @IsNotEmpty()
    @IsUUID('all')
    employeeId: string;
}
