import { IUserBase } from "./user.interface";

export interface IClient {
    id: string;
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

export interface ISendEmailResetpassword {
    token: string;
}

export interface ICheckEmailResetpassword {
    expired: Date;
}

export interface IApiResetPassword {
    token: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
}
