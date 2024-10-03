import { EServiceEmployeeExperience } from "@/enum/service.enum";
import { ICategory } from "./category.interface";
import { IEmployee, IEmployeeShift, IUserEmployee } from "./employee.interface";
import { IMedia } from "./media.interface";

export interface IService {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    categoryId: string;
    category: ICategory;
    media: IServiceMedia[];
}

export interface IServiceSnapshot {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    categoryId: string;
    category: ICategory | null;
    media: IServiceMedia[];
}
export interface IServiceMedia {
    serviceId: string;
    mediaId: string;
    isThumbnail: boolean;
    media: IMedia;
}

export interface IServiceMediaForm {
    mediaId?: string;
    mediaUrl?: string;
    isThumbnail: boolean;
}

export interface IServiceBaseCreate {
    name: string;
    description?: string;
    price: number;
    duration: number;
    medias: IServiceMediaForm[];
}

export interface IServiceEmployee {
    employeeId: string;
    experience: EServiceEmployeeExperience;
}

export interface IServiceEmployeeCreate {
    employee: IEmployee;
    experience: EServiceEmployeeExperience;
}

export interface IServiceStep {
    name: string;
    description: string;
    thumbnailId?: string;
    thumbnailUrl?: string;
    thumbnail?: IMedia | null;
}

export interface IServiceStepCreate {
    name: string;
    step: number;
    description: string;
    thumbnail?: IMedia | null;
    thumbnailId?: string;
    thumbnailUrl?: string;
}

export interface IServiceCreate {
    base: IServiceBaseCreate;
    employees: IServiceEmployee[];
    steps: IServiceStepCreate[];
}

export interface IFindService {
    page: number;
    limit: number;
    count: number;
    items: IService[];
}

export interface IServiceBaseDetail {
    id: string;
    name: string;
    price: number;
    duration: number;
    description: string;
    updatedAt: Date;
    createdAt: Date;
    categoryId: string;
    category: ICategory;
    userUpdate: IUserEmployee;
    userCreate: IUserEmployee;
    media: IServiceMedia[];
}

export interface IServiceEmployeeDetail {
    employeeId: string;
    experience: EServiceEmployeeExperience;
    employee: IEmployee;
}

export interface IServiceStepDetail {
    id: string;
    name: string;
    description: string;
    step: number;
    thumbnailId: string;
    thumbnail: IMedia | null;
}

export interface IServiceDetail {
    base: IServiceBaseDetail;
    employees: IServiceEmployeeDetail[];
    steps: IServiceStepDetail[];
}

export interface IServiceBaseUpdate {
    serviceId: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    categoryId: string;
    medias: IServiceMediaForm[];
}

export interface IServiceStepUpdate {
    id?: string;
    name: string;
    step: number;
    description: string;
    thumbnailId?: string;
    thumbnailUrl?: string;
    thumbnail?: IMedia | null;
}

export interface IServiceUpdate {
    base: IServiceBaseUpdate;
    employees: IServiceEmployee[];
    steps: IServiceStepUpdate[];
}

export interface IServiceItemOrder {
    id: string;
    serviceCartId: string;

    serviceSnapshot: IService;
    serviceId: string;

    employeeSnapShot: IEmployeeShift;
    employeeId: string;

    bookingTime: Date;
    shiftId: string;
}
