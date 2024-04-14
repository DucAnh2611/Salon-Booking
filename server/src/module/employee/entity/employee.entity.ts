import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { PermissionEntity } from '../../permission/entity/permission.entity';
import { RoleEntity } from '../../role/enitty/role.entity';

@Entity('employee')
export class EmployeeEntity extends ModifyEntity {
  @PrimaryColumn('uuid')
  id: number;

  @Column('integer')
  roleId: number;

  @ManyToOne(() => RoleEntity, (roleEntity: RoleEntity) => roleEntity.userRole)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @OneToMany(() => PermissionEntity, (permissionEntity: PermissionEntity) => permissionEntity.userCreate)
  createPermisison: PermissionEntity[];

  @OneToMany(() => PermissionEntity, (permissionEntity: PermissionEntity) => permissionEntity.userUpdate)
  updatePermisison: PermissionEntity[];

  @OneToMany(() => RoleEntity, (roleEntity: RoleEntity) => roleEntity.userCreate)
  createRole: RoleEntity[];

  @OneToMany(() => RoleEntity, (roleEntity: RoleEntity) => roleEntity.userUpdate)
  updateRole: RoleEntity[];
}
