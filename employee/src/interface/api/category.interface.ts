import { IEmployeeModify } from "./employee.interface";
import { IMedia } from "./media.interface";

export interface ICategory {
    id: string;
    level: number;
    title: string;
    parentId: string | null;
    parent: ICategory | null;
    createdAt: Date;
    updatedAt: Date;
    userCreate: IEmployeeModify;
    userUpdate: IEmployeeModify;
    image: IMedia | null;
}

export interface IFindCategory {
    count: number;
    limit: number;
    page: number;
    items: ICategory[];
}
