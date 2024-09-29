import { ICategory } from "./category.interface";
import { IEmployeeShift } from "./employee.interface";
import { IMedia } from "./media.interface";
import { IProductItemSearch } from "./product.interface";
import { IShift } from "./shift.interface";

export interface IService {
    id: string;
    name: string;
    price: number;

    media: IServiceMedia[];
    steps: IServiceStep[];

    deletedAt: Date;
    duration: number;
    description: string;

    category: ICategory;
    categoryId: string;
}

export interface IServiceMedia {
    serviceId: string;
    mediaId: string | null;
    isThumbnail: boolean;
    media: IMedia | null;
}

export interface IServiceStep {
    id: string;
    thumbnail: IMedia | null;
    thumbnailId: string | null;
    name: string;
    description: string;
    step: number;
}

export interface IServiceDetail extends IService {}

export interface IServiceItemCart extends IService {
    id: string;
    cartServiceId: string;

    service: IService;
    serviceId: string;

    duration: number;

    createdAt: Date;
}

export interface IServiceItemCartBooking extends IServiceItemCart {
    employee: IEmployeeShift | null;
    shift: IShift | null;
    bookingTime: Date | null;
}
export interface IApiSearchservicePriceRange {
    from: number;
    to?: number;
}
export interface IApiSearchserviceDuration {
    from: number;
    to?: number;
}

export interface IApiSearchService {
    key: string;
    price: IApiSearchservicePriceRange;
    duration: IApiSearchserviceDuration;
    categoryIds?: string[];
    page: number;
    limit: number;
}

export interface IServiceItemSearch extends IService {
    stepCounts: number;
    bookingCounts: number;
}

export interface ISearchServiceResponse {
    items: IServiceItemSearch[];
    count: number;
    page: number;
    limit: number;
}

export interface ISerivceItemFeature extends IService {
    stepCounts: number;
    bookingCounts: number;
}

export interface IRelatedServiceResponse {
    products: IProductItemSearch[];
    services: IServiceItemSearch[];
}

export interface IserviceItemOrder {
    id: string;
    serviceCartId: string;

    serviceSnapshot: IService;
    serviceId: string;

    employeeSnapShot: IEmployeeShift;
    employeeId: string;

    bookingTime: Date;
    shiftId: string;
}
export interface IServiceOrderTracking {
    services: IserviceItemOrder[];
}
