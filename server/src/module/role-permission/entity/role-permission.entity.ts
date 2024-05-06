import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ModifyOnlyEntity } from '../../../common/enitty/modify.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { PermissionEntity } from '../../permission/entity/permission.entity';
import { RoleEntity } from '../../role/enitty/role.entity';

@Entity('role_permission')
export class RolePermissionEntity extends ModifyOnlyEntity {
  @PrimaryColumn()
  roleId: string;

  @PrimaryColumn()
  permissionId: string;

  @ManyToOne(() => RoleEntity, (roleEntity: RoleEntity) => roleEntity.rolePermission)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, (permissionEntity: PermissionEntity) => permissionEntity.rolePermission)
  @JoinColumn({ name: 'permissionId' })
  permission: PermissionEntity;

  @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createRolePermission)
  @JoinColumn({ name: 'createdBy' })
  userCreate: EmployeeEntity;

  @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateRolePermission)
  @JoinColumn({ name: 'updatedBy' })
  userUpdate: EmployeeEntity;
}
