import { PermissionActionEnum, PermissionTargetEnum } from '../../../../common/enum/permission.enum';
import { EmployeeEntity } from '../../../employee/entity/employee.entity';
import { CreatePermissionDto } from '../../../permission/dto/create-permission.dto';
import { CreateUserDto } from '../../../user/dto/create-user.dto';
import { UserEntity } from '../../../user/entity/user.entity';

export type TSeedData = {
    employee: Array<TSeedEmployeeData>;
    role: TSeedRole[];
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

export type TSeedRole = {
    title: string;
    parent?: string | null;
    deletable: boolean;
    description?: string;
};
