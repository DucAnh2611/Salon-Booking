import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';
import { RolePermissionEntity } from '../../role-permission/entity/role-permission.entity';

@Entity('permission')
export class PermissionEntity extends BaseEntity {
  @Column('enum', { enum: PermissionTargetEnum })
  target: PermissionTargetEnum;

  @Column('enum', { enum: PermissionActionEnum })
  action: PermissionActionEnum;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany(
    () => RolePermissionEntity,
    (rolePermissionEntity: RolePermissionEntity) => rolePermissionEntity.permission,
  )
  rolePermission: RolePermissionEntity[];
}
