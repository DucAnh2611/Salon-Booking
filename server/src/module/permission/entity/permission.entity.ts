import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { RolePermissionEntity } from '../../role-permission/entity/role-permission.entity';

@Entity('permission')
export class PermissionEntity extends ModifyEntity {
  @PrimaryColumn('integer')
  id: number;

  @Column('text')
  title: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany(
    () => RolePermissionEntity,
    (rolePermissionEntity: RolePermissionEntity) => rolePermissionEntity.permission,
  )
  rolePermission: RolePermissionEntity[];

  @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createPermisison)
  @JoinColumn({ name: 'createdBy' })
  userCreate: EmployeeEntity;

  @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updatePermisison)
  @JoinColumn({ name: 'createdBy' })
  userUpdate: EmployeeEntity;
}
