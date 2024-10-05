import { IMedia } from "./media.interface";

export interface IOrganization {
    id: string;
    name: string;
    logo: IMedia | null;
    phone: string;
    gmail: string;
    address: string;

    zalo?: string;
    facebook?: string;
    instagram?: string;
}
