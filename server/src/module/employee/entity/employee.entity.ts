import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { AttrbuteEntity } from '../../attribute/entity/attribute.entity';
import { RolePermissionEntity } from '../../role-permission/entity/role-permission.entity';
import { RoleEntity } from '../../role/enitty/role.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('employee')
export class EmployeeEntity extends ModifyEntity {
    @Column('varchar', { unique: true, nullable: false })
    username: string;

    @Column('uuid', { name: 'userId' })
    userId: string;

    @Column('uuid')
    eRoleId: string;

    @ManyToOne(() => RoleEntity, (roleEntity: RoleEntity) => roleEntity.userRole, { nullable: true })
    @JoinColumn({ name: 'eRoleId' })
    eRole: RoleEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEnitty: EmployeeEntity) => employeeEnitty.createEmployee, {
        nullable: true,
    })
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEnitty: EmployeeEntity) => employeeEnitty.updateEmployee)
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: EmployeeEntity;

    @OneToMany(() => RoleEntity, (roleEntity: RoleEntity) => roleEntity.userCreate)
    createRole: RoleEntity[];

    @OneToMany(() => RoleEntity, (roleEntity: RoleEntity) => roleEntity.userUpdate)
    updateRole: RoleEntity[];

    @OneToMany(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.userCreate)
    createEmployee: EmployeeEntity[];

    @OneToMany(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.userUpdate)
    updateEmployee: EmployeeEntity[];

    @OneToMany(() => AttrbuteEntity, (attributeEntity: AttrbuteEntity) => attributeEntity.userCreate)
    createAttribute: AttrbuteEntity[];

    @OneToMany(() => AttrbuteEntity, (attributeEntity: AttrbuteEntity) => attributeEntity.userUpdate)
    updateAttribute: AttrbuteEntity[];

    @OneToMany(
        () => RolePermissionEntity,
        (rolePermisisonEntity: RolePermissionEntity) => rolePermisisonEntity.userCreate,
    )
    createRolePermission: RolePermissionEntity[];

    @OneToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.employee)
    @JoinColumn({ name: 'userId' })
    userBase: UserEntity;
}
