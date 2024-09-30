import { IUserBase } from "./user.interface";

export interface IClient {
    id: string;
    phone: string;
    email: string;

    phoneVerified: boolean;
    emailVerified: boolean;

    lockAccount: boolean;
    lockOrder: boolean;

    userBase: IUserBase;
}

export interface IClientInfo extends IClient {}

export interface IVerifyEmailResponse {
    expired: Date;
}
