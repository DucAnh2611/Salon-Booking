import { Column, Entity, ManyToOne } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';

@Entity('attribute')
export class AttrbuteEntity extends ModifyEntity {
  @Column('varchar', { length: 50 })
  name: string;

  @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createAttribute)
  userCreate: EmployeeEntity;

  @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateAttribute)
  userUpdate: EmployeeEntity;
}
