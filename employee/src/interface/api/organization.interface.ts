import { IUserEmployee } from "./employee.interface";
import { IMedia } from "./media.interface";

export interface IOrganization {
    id: string;
    name: string;
    address: string;
    phone: string;
    logoId: string;
    gmail: string;

    facebook?: string;
    zalo?: string;
    instagram?: string;

    logo: IMedia | null;
    isShow: boolean;

    userCreate: IUserEmployee;
    userUpdate: IUserEmployee;

    createdAt: Date;
    updatedAt: Date;
}

export interface IOrganizationDetail extends IOrganization {}

export interface IOrganizationCreate {
    name: string;
    address: string;
    phone: string;
    gmail: string;
    logoUrl: string;

    facebook?: string;
    zalo?: string;
    instagram?: string;
}

export interface IOrganizationUpdate {
    name: string;
    address: string;
    phone: string;
    gmail: string;
    logoId?: string;
    logoUrl?: string;

    facebook?: string;
    zalo?: string;
    instagram?: string;
}

export interface IApiOrganizationList {
    page: number;
    limit: number;
}

export interface IOrganizationListResponse {
    page: number;
    limit: number;
    count: number;
    items: IOrganization[];
}
