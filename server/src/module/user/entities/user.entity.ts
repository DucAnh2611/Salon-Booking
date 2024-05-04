import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GenderEnum } from '../../../common/enum/gender.enum';
import { EmployeeEntity } from '../../employee/entity/employee.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date', { nullable: false })
  birthday: Date;

  @Column('enum', { nullable: false, enum: GenderEnum })
  gender: GenderEnum;

  @Column('varchar', { length: 320, nullable: false })
  email: string;

  @Column('bytea', { nullable: false })
  password: string;

  @Column('varchar', { length: 100, nullable: false })
  firstname: string;

  @Column('varchar', { length: 100, nullable: false })
  lastname: string;

  @OneToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.userBase)
  employee: EmployeeEntity;
}
