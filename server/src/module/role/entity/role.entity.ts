import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { RolePermissionEntity } from '../../role-permission/entity/role-permission.entity';

@Entity('role')
export class RoleEntity extends ModifyEntity {
    @Column('text', { nullable: false })
    title: string;

    @Column('text', { nullable: true, default: '' })
    description: string;

    @Column('boolean', { nullable: false, default: false })
    deletable: boolean;

    @Column('integer', { nullable: false, default: 1 })
    level: number;

    @DeleteDateColumn()
    deletedAt: Date;

    @Column('uuid', { nullable: true })
    parentId: string;

    @OneToMany(() => RoleEntity, (roleEntity: RoleEntity) => roleEntity.parent)
    childrens: RoleEntity[];

    @ManyToOne(() => RoleEntity, (roleEntity: RoleEntity) => roleEntity.childrens, { nullable: true })
    @JoinColumn({ name: 'parentId' })
    parent: RoleEntity;

    @OneToMany(() => RolePermissionEntity, (rolePermissionEntity: RolePermissionEntity) => rolePermissionEntity.role)
    rolePermission: RolePermissionEntity[];

    @OneToMany(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.eRole)
    empRole: EmployeeEntity[];

    @ManyToOne(() => EmployeeEntity, (employeeEnitty: EmployeeEntity) => employeeEnitty.createRole, { eager: true })
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEnitty: EmployeeEntity) => employeeEnitty.updateRole, { eager: true })
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: EmployeeEntity;
}
