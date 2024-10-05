import {
    IOrganization,
    IOrganizationDetail,
} from "../api/organization.interface";
import { ICRUDInitialState } from "./base.interface";

export interface IInitialStateOrganization extends ICRUDInitialState {
    items: IOrganization[];
    current: IOrganization | null;
    detail: IOrganizationDetail | null;
    page: number;
    limit: number;
    count: number;
}

export interface IActionDedicateOrganization {
    items?: IOrganization[];
    detail?: IOrganizationDetail | null;
    current?: IOrganization | null;
    page?: number;
    limit?: number;
    count?: number;
}
