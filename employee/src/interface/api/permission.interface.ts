import { EAction, ETarget } from "@/enum/permisssion.enum";

export interface IPermission {
    id: string;
    target: ETarget;
    action: EAction;
}

export interface IGroupPermission {
    target: ETarget;
    actions: Array<{ action: EAction; id: string }>;
}

export interface IListAllPermission {
    items: IPermission[];
}
