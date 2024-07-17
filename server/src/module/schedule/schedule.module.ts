import { Module } from '@nestjs/common';
import { ShiftEmployeeModule } from '../shift-employee/shift-employee.module';
import { ShiftModule } from '../shift/shift.module';
import { WorkingHourModule } from '../working-hour/working-hour.module';

@Module({
    imports: [WorkingHourModule, ShiftModule, ShiftEmployeeModule],
})
export class ScheduleModule {}
