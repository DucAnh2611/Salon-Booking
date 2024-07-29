import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { ShiftEmployeeEntity } from '../../shift-employee/entity/shift-employee.entity';
import { WorkingHourEntity } from '../../working-hour/entity/working-hour.entity';

@Index(['workingHourId'])
@Entity('shift')
export class ShiftEntity extends ModifyEntity {
    @Column('timestamp with time zone')
    start: Date;

    @Column('timestamp with time zone')
    end: Date;

    @Column('timestamp with time zone')
    bookingStart: Date;

    @Column('timestamp with time zone')
    bookingEnd: Date;

    @Column('uuid')
    workingHourId: string;

    @OneToMany(() => ShiftEmployeeEntity, (shiftEmployeeEntity: ShiftEmployeeEntity) => shiftEmployeeEntity.shift)
    shiftEmployee: ShiftEmployeeEntity[];

    @ManyToOne(() => WorkingHourEntity, (workingHourEntity: WorkingHourEntity) => workingHourEntity.shifts)
    @JoinColumn({ name: 'workingHourId' })
    workingHour: WorkingHourEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createShift)
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateShift)
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: EmployeeEntity;
}
