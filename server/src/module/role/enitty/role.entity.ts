import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { RolePermissionEntity } from '../../role-permission/entity/role-permission.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('role')
export class RoleEntity extends ModifyEntity {
    @Column('text', { nullable: false })
    title: string;

    @Column('boolean', { nullable: false, default: false })
    deletable: boolean;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => RolePermissionEntity, (rolePermissionEntity: RolePermissionEntity) => rolePermissionEntity.role)
    rolePermission: RolePermissionEntity[];

    @OneToMany(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.eRole)
    empRole: EmployeeEntity[];

    @OneToMany(() => UserEntity, (userEntity: UserEntity) => userEntity.role)
    userRole: UserEntity[];

    @ManyToOne(() => EmployeeEntity, (employeeEnitty: EmployeeEntity) => employeeEnitty.createRole)
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEnitty: EmployeeEntity) => employeeEnitty.updateRole)
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: EmployeeEntity;
}
