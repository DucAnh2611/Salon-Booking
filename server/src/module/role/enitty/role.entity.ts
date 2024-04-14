import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { RolePermissionEntity } from '../../role-permission/entity/role-permission.entity';

@Entity('role')
export class RoleEntity extends ModifyEntity {
  @PrimaryColumn('integer')
  id: number;

  @Column('text')
  title: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => RolePermissionEntity, (rolePermissionEntity: RolePermissionEntity) => rolePermissionEntity.role)
  rolePermission: RolePermissionEntity[];

  @OneToMany(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.role)
  userRole: EmployeeEntity[];

  @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createRole)
  @JoinColumn({ name: 'createdBy' })
  userCreate: EmployeeEntity;

  @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateRole)
  @JoinColumn({ name: 'createdBy' })
  userUpdate: EmployeeEntity;
}
