import { PermissionActionEnum, PermissionTargetEnum } from '../../../../common/enum/permission.enum';
import { EmployeeEntity } from '../../../employee/entity/employee.entity';
import { CreatePermissionDto } from '../../../permission/dto/create-permission.dto';
import { CreateRoleDto } from '../../../role/dto/create-role.dto';
import { CreateUserDto } from '../../../user/dto/create-user.dto';
import { UserEntity } from '../../../user/entity/user.entity';

export type TSeedData = {
    employee: Array<TSeedEmployeeData>;
    role: CreateRoleDto[];
    permission: CreatePermissionDto[];
    rolePermission: Array<TSeedRolePermissionData>;
};

export type TSeedRolePermissionData = {
    data: TSeedRolePermisison[];
    role: string;
};

export type TSeedRolePermisison = {
    action: PermissionActionEnum[];
    target: PermissionTargetEnum;
};

export type TSeedEmployeeData = CreateUserDto & {
    role: string;
    eRole?: string;
    username: string;
};

export type TSeedEmployee = {
    employees: EmployeeEntity[];
    users: UserEntity[];
};
