import { IUserEmployee } from "./employee.interface";
import { IPermission } from "./permission.interface";

export interface IRole {
    id: string;
    title: string;
    description: string;
    deletable: false;
    parentId: string | null;
    parent: IRole | null;
}

export interface IRoleDetail extends IRole {
    id: string;
    title: string;
    description: string;
    deletable: false;
    parentId: string | null;
    parent: IRole | null;
    rolePermission: IRolePermission[];
    createdAt: Date;
    updatedAt: Date;
    userCreate: IUserEmployee;
    userUpdate: IUserEmployee;
}

export interface IRolePermission {
    roleId: string;
    permissionId: string;
    permission: IPermission;
}

export interface IFindRole {
    items: IRole[];
    count: number;
    page: number;
    limit: number;
}

export interface IRoleUpdate {
    title: string;
    parentId?: string | null;
    permissionIds: string[];
    description: string;
}

export interface IRoleCreate {
    title: string;
    parentId?: string;
    description: string;
    parent: IRole | null;
}

export interface IRoleCreateRedux extends IRoleCreate {
    permissionIds: string[];
}
