import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { GenderEnum } from '../../../common/enum/gender.enum';

@Entity('user')
export class User extends BaseEntity {
  @Column('datetime')
  birthday: Date;

  @Column('enum')
  gender: GenderEnum;
}
