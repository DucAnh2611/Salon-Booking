import { ESortBy } from "@/enum/query.enum";
import { IUser } from "./employee.interface";

export interface IClient {
    id: string;
    email: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    lockAccount: boolean;
    lockOrder: boolean;
    createdAt: Date;
    userBase: IUser;
}

export interface IFilterClientList {
    name?: string;
    email?: string;
    phone?: string;
    lockAccount?: boolean;
    lockOrder?: boolean;
}

export interface IOrderClientList {
    createdAt?: ESortBy;
    updatedAt?: ESortBy;
}

export interface IApiClientList {
    filter: IFilterClientList;
    order: IOrderClientList;
    page: number;
    limit: number;
}

export interface IClientList extends IClient {}

export interface IClientResponse {
    items: IClientList[];
    page: number;
    limit: number;
    count: number;
}

export interface IApiUpdateLockClient {
    clientId: string;
    lockAccount?: boolean;
    lockOrder?: boolean;
}
