import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { DEFAULT_VALUE_ENTITY } from '../../../common/constant/entity.constant';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { GenderEnum } from '../../../common/enum/gender.enum';
import { HashPasswordUtil } from '../../../shared/utils/hash-password.utils';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { RoleEntity } from '../../role/enitty/role.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
    @Column('date', { nullable: false, default: DEFAULT_VALUE_ENTITY.birthday })
    birthday: Date;

    @Column('enum', { nullable: false, enum: GenderEnum })
    gender: GenderEnum;

    @Column('varchar', { length: 320, nullable: false })
    email: string;

    @Column('text', { nullable: false })
    password: string;

    @Column('varchar', { length: 100, nullable: false })
    firstname: string;

    @Column('varchar', { length: 100, nullable: false })
    lastname: string;

    @Column('uuid', { nullable: false })
    roleId: string;

    @OneToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.userBase, { nullable: true })
    employee: EmployeeEntity;

    //TODO - Add client relationShip

    @ManyToOne(() => RoleEntity, (roleEntity: RoleEntity) => roleEntity.userRole, { nullable: true })
    @JoinColumn({ name: 'roleId' })
    role: RoleEntity;

    @BeforeInsert()
    async hashPassword() {
        this.password = await HashPasswordUtil.hashPassword(this.password);
    }
}
