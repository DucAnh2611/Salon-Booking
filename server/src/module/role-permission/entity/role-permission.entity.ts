import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { PermissionEntity } from '../../permission/entity/permission.entity';
import { RoleEntity } from '../../role/enitty/role.entity';

@Entity('role_permission')
export class RolePermissionEntity extends ModifyEntity {
  @PrimaryColumn({ name: 'roleId' })
  roleId: string;

  @PrimaryColumn({ name: 'permissionId' })
  permissionId: string;

  @ManyToOne(() => RoleEntity, (roleEntity: RoleEntity) => roleEntity.rolePermission)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, (permissionEntity: PermissionEntity) => permissionEntity.rolePermission)
  @JoinColumn({ name: 'permissionId' })
  permission: PermissionEntity;
}
