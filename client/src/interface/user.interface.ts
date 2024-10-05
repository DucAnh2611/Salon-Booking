import { EGender } from "../enum/gender.enum";
import { IMedia } from "./media.interface";

export interface IUserClient {
    id: string;
    email: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    userId: string;
    userBase: IUserBase;
}

export interface IUserBase {
    birthday: Date;
    gender: EGender;
    firstname: string;
    lastname: string;
    roleId: string;
    phone: string;
    avatar: string;
    userAvatar: IMedia | null;
}

export interface IAPIUserClientMe {
    id: string;
    email: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    userId: string;
    userBase: IUserBase;
}

export interface IApiLogin {
    email: string;
    password: string;
}

export interface IApiSignup {
    email: string;
    phone: string;
    password: string;
    birthday: string;
    gender: EGender;
    firstname: string;
    lastname: string;
}

export interface IApiLoginResponse {
    accessToken: string;
}

export interface IApiRefreshResponse {
    accessToken: string;
}
