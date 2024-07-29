import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ModifyOnlyEntity } from '../../../common/enitty/modify.entity';
import { ShiftEmployeeStatusEnum } from '../../../common/enum/shift.enum';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { ShiftEntity } from '../../shift/entity/shift.entity';

@Index(['shiftId', 'employeeId'])
@Entity('shift_employee')
export class ShiftEmployeeEntity extends ModifyOnlyEntity {
    @PrimaryColumn('uuid')
    shiftId: string;

    @PrimaryColumn('uuid')
    employeeId: string;

    @Column('enum', { enum: ShiftEmployeeStatusEnum })
    status: ShiftEmployeeStatusEnum;

    @ManyToOne(() => ShiftEntity, (shiftEntity: ShiftEntity) => shiftEntity.shiftEmployee)
    @JoinColumn({ name: 'shiftId' })
    shift: ShiftEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.assignShiftEmployee)
    @JoinColumn({ name: 'employeeId' })
    employee: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createShiftEmployee)
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateShiftEmployee)
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: EmployeeEntity;
}
