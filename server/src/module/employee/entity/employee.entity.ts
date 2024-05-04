import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { AttrbuteEntity } from '../../attribute/entity/attribute.entity';
import { PermissionEntity } from '../../permission/entity/permission.entity';
import { RoleEntity } from '../../role/enitty/role.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('employee')
export class EmployeeEntity extends ModifyEntity {
  @Column('varchar', { unique: true, nullable: false })
  username: string;

  @Column('uuid', { name: 'userId' })
  userId: string;

  @Column('integer')
  roleId: number;

  @ManyToOne(() => RoleEntity, (roleEntity: RoleEntity) => roleEntity.userRole)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @ManyToOne(() => EmployeeEntity, (employeeEnitty: EmployeeEntity) => employeeEnitty.createEmployee)
  @JoinColumn({ name: 'createdBy' })
  userCreate: EmployeeEntity;

  @ManyToOne(() => EmployeeEntity, (employeeEnitty: EmployeeEntity) => employeeEnitty.updateEmployee)
  @JoinColumn({ name: 'updatedBy' })
  userUpdate: EmployeeEntity;

  @OneToMany(() => PermissionEntity, (permissionEntity: PermissionEntity) => permissionEntity.userCreate)
  createPermisison: PermissionEntity[];

  @OneToMany(() => PermissionEntity, (permissionEntity: PermissionEntity) => permissionEntity.userUpdate)
  updatePermisison: PermissionEntity[];

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

  @OneToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.employee)
  @JoinColumn({ name: 'userId' })
  userBase: UserEntity;
}
