import { IPermission } from "../api/permission.interface";

export interface IInitialStatePermission {
    permissions: IPermission[];
    isCalling: boolean;
    isFailure: boolean;
}

export interface IActionDedicatePermission {
    permissions?: IPermission[];
}
