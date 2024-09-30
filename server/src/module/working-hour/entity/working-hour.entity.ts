import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { ShiftEntity } from '../../shift/entity/shift.entity';

@Index(['date', 'start', 'end'])
@Entity('working_date')
export class WorkingHourEntity extends ModifyEntity {
    @Column('timestamp with time zone')
    date: Date;

    @Column('timestamp with time zone', { nullable: true })
    start: Date;

    @Column('timestamp with time zone', { nullable: true })
    end: Date;

    @Column('boolean', { default: false })
    isOff: boolean;

    @OneToMany(() => ShiftEntity, (shiftEntity: ShiftEntity) => shiftEntity.workingHour)
    shifts: ShiftEntity[];

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createWorkingHour)
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateWorkingHour)
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: EmployeeEntity;
}
