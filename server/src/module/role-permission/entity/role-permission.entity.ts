import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CreateOnlyEntity } from '../../../common/enitty/create.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { PermissionEntity } from '../../permission/entity/permission.entity';
import { RoleEntity } from '../../role/entity/role.entity';

@Entity('role_permission')
export class RolePermissionEntity extends CreateOnlyEntity {
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
}
