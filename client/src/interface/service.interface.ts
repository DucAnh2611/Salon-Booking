import { IEmployeeShift } from "./employee.interface";
import { IMedia } from "./media.interface";
import { IShift } from "./shift.interface";

export interface IService {
    id: string;
    name: string;
    price: number;

    serviceMedia: IServiceMedia[];

    deletedAt: Date;
    duration: number;
}

export interface IServiceMedia {
    productId: string;
    mediaId: string | null;
    isThumbnail: boolean;
    media: IMedia | null;
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

export interface ISerivceItemSearch extends IService {
    stepCounts: number;
    bookingCounts: number;
}

export interface ISearchserviceResponse {
    items: ISerivceItemSearch[];
    count: number;
    page: number;
    limit: number;
}

export interface ISerivceItemFeature extends IService {
    stepCounts: number;
    bookingCounts: number;
}
