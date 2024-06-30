import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { AttributeEntity } from '../../attribute/entity/attribute.entity';
import { CategoryEntity } from '../../category/entity/category.entity';
import { RolePermissionEntity } from '../../role-permission/entity/role-permission.entity';
import { RoleEntity } from '../../role/entity/role.entity';
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

    @OneToMany(() => AttributeEntity, (attributeEntity: AttributeEntity) => attributeEntity.employeeCreate)
    createAttribute: AttributeEntity[];

    @OneToMany(() => AttributeEntity, (attributeEntity: AttributeEntity) => attributeEntity.employeeUpdate)
    updateAttribute: AttributeEntity[];

    @OneToMany(
        () => RolePermissionEntity,
        (rolePermisisonEntity: RolePermissionEntity) => rolePermisisonEntity.userCreate,
    )
    createRolePermission: RolePermissionEntity[];

    @OneToMany(() => CategoryEntity, (categoryEntity: CategoryEntity) => categoryEntity.userCreate)
    createCategory: CategoryEntity[];

    @OneToMany(() => CategoryEntity, (categoryEntity: CategoryEntity) => categoryEntity.userUpdate)
    updateCategory: CategoryEntity[];

    @OneToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.employee, { eager: true })
    @JoinColumn({ name: 'userId' })
    userBase: UserEntity;
}
